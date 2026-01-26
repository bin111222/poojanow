import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, MapPin, User, FileText, Image as ImageIcon, Download, Sparkles } from "lucide-react"
import Link from "next/link"

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      services (title, description, duration_minutes, pooja_explanation),
      temples (name, address, city, state),
      pandit_profiles:pandit_id (
        profiles:id (full_name, phone)
      ),
      booking_proofs (id, storage_path, media_type, status, created_at)
    `)
    .eq("id", params.id)
    .eq("user_id", user!.id)
    .single()

  // Get signed URLs for proofs
  const proofs = booking?.booking_proofs?.filter((p: any) => p.status === 'uploaded' || p.status === 'approved') || []
  const proofUrls: string[] = []
  
  for (const proof of proofs) {
    const { data } = await supabase
      .storage
      .from('pooja-proofs')
      .createSignedUrl(proof.storage_path.replace('pooja-proofs/', ''), 3600) // 1 hour expiry
    
    if (data?.signedUrl) {
      proofUrls.push(data.signedUrl)
    }
  }

  // Get certificate URL if exists
  let certificateUrl: string | null = null
  if (booking?.certificate_path) {
    const { data } = await supabase
      .storage
      .from('certificates')
      .createSignedUrl(booking.certificate_path.replace('certificates/', ''), 3600)
    
    if (data?.signedUrl) {
      certificateUrl = data.signedUrl
    }
  }

  if (!booking) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Booking Details</h1>
        <Badge className="text-base px-4 py-1" variant={
            booking.status === 'confirmed' ? 'default' : 
            booking.status === 'completed' ? 'secondary' : 
            booking.status === 'cancelled' ? 'destructive' : 'outline'
        }>
            {booking.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{booking.services?.title}</h3>
              <p className="text-sm text-muted-foreground">{booking.services?.description}</p>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{booking.services?.duration_minutes} mins duration</span>
            </div>

            <div className="pt-4 border-t space-y-2">
                {booking.scheduled_start && booking.scheduled_end ? (
                  <>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Scheduled Window:</span>
                        <span className="font-medium text-right">
                            {format(new Date(booking.scheduled_start), "PPP p")}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">End Time:</span>
                        <span className="font-medium">
                            {format(new Date(booking.scheduled_end), "p")}
                        </span>
                    </div>
                  </>
                ) : booking.scheduled_at ? (
                  <>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Scheduled Date:</span>
                        <span className="font-medium">
                            {format(new Date(booking.scheduled_at), "PPP")}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">
                            {format(new Date(booking.scheduled_at), "p")}
                        </span>
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground">Not Scheduled</div>
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location & Pandit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {booking.temples && (
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                        <p className="font-medium">{booking.temples.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {booking.temples.address}, {booking.temples.city}, {booking.temples.state}
                        </p>
                    </div>
                </div>
            )}

            {booking.pandit_profiles ? (
                <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                        <p className="font-medium">{booking.pandit_profiles.profiles?.full_name}</p>
                        <p className="text-sm text-muted-foreground">Assigned Pandit</p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Pandit assignment pending</span>
                </div>
            )}
          </CardContent>
        </Card>

        {booking.status === 'completed' && (
          <>
            {/* Post-Pooja Closure Screen (Phase 1.6) */}
            <Card className="md:col-span-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2 text-2xl">
                  <CheckCircle2 className="h-6 w-6" />
                  Pooja Completed Successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* What was done explanation */}
                <div className="bg-white rounded-lg p-6 border border-green-100">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    What Was Done
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {booking.services?.pooja_explanation || booking.services?.description || 
                     'The Rudrabhishek pooja has been performed with devotion and according to Vedic traditions. The ritual involved the ceremonial bathing of the Shiva Lingam with sacred substances, accompanied by the chanting of powerful mantras.'}
                  </p>
                </div>

                {/* Proof and Certificate */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Proof Section */}
                  <div className="bg-white rounded-lg p-6 border border-green-100">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-green-600" />
                      Proof of Pooja
                    </h3>
                    {proofs.length > 0 ? (
                      <div className="space-y-3">
                        {proofs.map((proof: any, idx: number) => (
                          proofUrls[idx] && (
                            <div key={proof.id} className="relative group">
                              {proof.media_type === 'image' ? (
                                <img
                                  src={proofUrls[idx]}
                                  alt={`Proof ${idx + 1}`}
                                  className="w-full h-32 object-cover rounded-md border border-green-100"
                                />
                              ) : (
                                <div className="w-full h-32 bg-muted rounded-md border border-green-100 flex items-center justify-center">
                                  <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                              <a
                                href={proofUrls[idx]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors rounded-md"
                              >
                                <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                                  View Full Size
                                </span>
                              </a>
                            </div>
                          )
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Proof pending upload</p>
                    )}
                  </div>

                  {/* Certificate Section */}
                  <div className="bg-white rounded-lg p-6 border border-green-100">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      Certificate
                    </h3>
                    {certificateUrl ? (
                      <div className="space-y-3">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-md p-6 border-2 border-amber-200 text-center">
                          <FileText className="h-12 w-12 mx-auto mb-3 text-amber-600" />
                          <p className="font-medium text-amber-900 mb-1">Pooja Certificate</p>
                          <p className="text-xs text-amber-700">Download your certificate</p>
                        </div>
                        <a
                          href={certificateUrl}
                          download
                          className="w-full"
                        >
                          <Button variant="outline" className="w-full border-green-200 bg-white text-green-700 hover:bg-green-50 hover:text-green-800">
                            <Download className="mr-2 h-4 w-4" />
                            Download Certificate
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Certificate is being generated...</p>
                    )}
                  </div>
                </div>

                {/* What devotees usually do next */}
                <div className="bg-white rounded-lg p-6 border border-green-100">
                  <h3 className="font-semibold text-lg mb-3">What Devotees Usually Do Next</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Many devotees perform follow-up rituals like Ganesh Pooja or Lakshmi Pooja for continued blessings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Share the prasad with family members to spread the divine blessings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Maintain a regular practice of prayer and meditation to deepen your spiritual connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Consider booking a follow-up pooja during auspicious occasions or festivals</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/temples" className="flex-1">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Book Another Pooja
                    </Button>
                  </Link>
                  <Link href="/u/bookings" className="flex-1">
                    <Button variant="outline" className="w-full border-green-200 bg-white text-green-700 hover:bg-green-50 hover:text-green-800">
                      View All Bookings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

