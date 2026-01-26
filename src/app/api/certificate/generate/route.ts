import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { Readable } from 'stream'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
    }

    // Fetch booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        services (title, pooja_explanation),
        temples (name),
        profiles:user_id (full_name)
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if certificate already exists
    if (booking.certificate_path) {
      return NextResponse.json({ 
        success: true, 
        certificatePath: booking.certificate_path,
        message: 'Certificate already exists'
      })
    }

    // Generate PDF certificate
    const pdfBuffer = await generateCertificatePDF(booking)

    // Upload PDF to storage
    const timestamp = Date.now()
    const path = `${bookingId}/certificate-${timestamp}.pdf`
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('certificates')
      .upload(path, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      })

    if (uploadError) {
      console.error('Certificate upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload certificate' }, { status: 500 })
    }

    const certificatePath = `certificates/${path}`

    // Update booking with certificate path
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ certificate_path: certificatePath })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Booking update error:', updateError)
      // Don't fail - certificate is uploaded
    }

    return NextResponse.json({
      success: true,
      certificatePath: certificatePath
    })
  } catch (error) {
    console.error('Certificate generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateCertificatePDF(booking: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    })

    const chunks: Buffer[] = []
    
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Extract data
    const devoteeName = booking.profiles?.full_name || 'Devotee'
    const templeName = booking.temples?.name || 'Temple'
    const poojaName = booking.services?.title || 'Pooja'
    const date = booking.scheduled_start 
      ? new Date(booking.scheduled_start).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : new Date().toLocaleDateString('en-IN')
    const time = booking.scheduled_start
      ? new Date(booking.scheduled_start).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      : ''

    // Page dimensions
    const pageWidth = doc.page.width
    const pageHeight = doc.page.height
    const margin = 50

    // Draw decorative border (gold)
    doc.rect(margin - 10, margin - 10, pageWidth - 2 * (margin - 10), pageHeight - 2 * (margin - 10))
      .lineWidth(3)
      .strokeColor('#d4af37')
      .stroke()

    // Inner border
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin)
      .lineWidth(1)
      .strokeColor('#8b4513')
      .stroke()

    // Title
    doc.fontSize(36)
      .fillColor('#8b4513')
      .text('CERTIFICATE OF POOJA', pageWidth / 2, margin + 40, {
        align: 'center',
        width: pageWidth - 2 * margin
      })

    // Subtitle
    doc.fontSize(14)
      .fillColor('#666666')
      .font('Helvetica-Oblique')
      .text('This certifies that the following pooja has been performed', pageWidth / 2, margin + 100, {
        align: 'center',
        width: pageWidth - 2 * margin
      })

    // Main content
    doc.font('Helvetica')
      .fontSize(16)
      .fillColor('#333333')
      .text('This is to certify that', pageWidth / 2, margin + 160, {
        align: 'center',
        width: pageWidth - 2 * margin
      })

    // Devotee name (emphasized)
    doc.fontSize(28)
      .fillColor('#8b4513')
      .font('Helvetica-Bold')
      .text(devoteeName, pageWidth / 2, margin + 200, {
        align: 'center',
        width: pageWidth - 2 * margin,
        underline: true
      })

    doc.font('Helvetica')
      .fontSize(16)
      .fillColor('#333333')
      .text('has performed', pageWidth / 2, margin + 250, {
        align: 'center',
        width: pageWidth - 2 * margin
      })

    // Pooja name (emphasized)
    doc.fontSize(24)
      .fillColor('#8b4513')
      .font('Helvetica-Bold')
      .text(poojaName, pageWidth / 2, margin + 290, {
        align: 'center',
        width: pageWidth - 2 * margin,
        underline: true
      })

    doc.font('Helvetica')
      .fontSize(16)
      .fillColor('#333333')
      .text('at', pageWidth / 2, margin + 340, {
        align: 'center',
        width: pageWidth - 2 * margin
      })

    // Temple name (emphasized)
    doc.fontSize(24)
      .fillColor('#8b4513')
      .font('Helvetica-Bold')
      .text(templeName, pageWidth / 2, margin + 380, {
        align: 'center',
        width: pageWidth - 2 * margin,
        underline: true
      })

    // Details section
    const detailsY = margin + 450
    doc.font('Helvetica')
      .fontSize(14)
      .fillColor('#333333')
      .text(`Date: ${date}`, margin + 100, detailsY)
    
    if (time) {
      doc.text(`Time: ${time}`, margin + 100, detailsY + 25)
    }
    
    doc.text(`Booking ID: ${booking.id.substring(0, 8)}`, margin + 100, detailsY + (time ? 50 : 25))

    // Footer with signatures
    const footerY = pageHeight - margin - 120
    doc.moveTo(margin + 50, footerY)
      .lineTo(pageWidth - margin - 50, footerY)
      .lineWidth(1)
      .strokeColor('#d4af37')
      .stroke()

    // Left signature (PoojaNow)
    doc.fontSize(12)
      .fillColor('#333333')
      .text('PoojaNow', margin + 100, footerY + 20, {
        align: 'center',
        width: 150
      })
    
    doc.moveTo(margin + 100, footerY + 50)
      .lineTo(margin + 250, footerY + 50)
      .strokeColor('#333333')
      .stroke()
    
    doc.fontSize(10)
      .fillColor('#666666')
      .text('Platform Seal', margin + 100, footerY + 60, {
        align: 'center',
        width: 150
      })

    // Right signature (Temple)
    doc.fontSize(12)
      .fillColor('#333333')
      .text(templeName, pageWidth - margin - 250, footerY + 20, {
        align: 'center',
        width: 150
      })
    
    doc.moveTo(pageWidth - margin - 250, footerY + 50)
      .lineTo(pageWidth - margin - 100, footerY + 50)
      .strokeColor('#333333')
      .stroke()
    
    doc.fontSize(10)
      .fillColor('#666666')
      .text('Temple Seal', pageWidth - margin - 250, footerY + 60, {
        align: 'center',
        width: 150
      })

    // Finalize PDF
    doc.end()
  })
}

