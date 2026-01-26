import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { format, formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Clock, AlertCircle, CheckCircle2, User, Upload, Calendar } from "lucide-react"
import { AssignPanditDialog } from "./assign-pandit-dialog"
import { UploadProofDialog } from "./upload-proof-dialog"
import { CompleteBookingDialog } from "./complete-booking-dialog"

export default async function TempleOpsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user's profile to check if they manage a temple
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // For now, allow admin and check for temple association
  // In production, you'd have a temple_admins table
  const isAdmin = profile?.role === 'admin'

  if (!isAdmin) {
    // TODO: Check if user is temple admin via temple_admins table
    redirect("/")
  }

  // Get today's date range (start and end of day in UTC)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Fetch today's bookings
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      services (title, duration_minutes),
      temples (name),
      profiles:user_id (full_name),
      pandit_profiles:pandit_id (
        profiles:id (full_name)
      ),
      booking_proofs (id, status)
    `)
    .gte('scheduled_start', today.toISOString())
    .lt('scheduled_start', tomorrow.toISOString())
    .in('status', ['confirmed', 'in_progress', 'completed'])
    .order('scheduled_start', { ascending: true })

  if (error) {
    console.error('Error fetching bookings:', error)
  }

  // Calculate proof counts and SLA status
  const bookingsWithStatus = bookings?.map(booking => {
    const proofs = booking.booking_proofs || []
    const proofCount = proofs.filter((p: any) => p.status === 'uploaded' || p.status === 'approved').length
    const hasProof = proofCount > 0

    // Calculate SLA status
    let slaStatus: 'ok' | 'warning' | 'breached' = 'ok'
    let slaMessage = ''
    
    if (booking.scheduled_end && booking.proof_sla_deadline) {
      const now = new Date()
      const deadline = new Date(booking.proof_sla_deadline)
      
      if (now > deadline && !hasProof) {
        slaStatus = 'breached'
        slaMessage = `SLA breached ${formatDistanceToNow(deadline, { addSuffix: true })}`
      } else if (now > booking.scheduled_end && !hasProof) {
        const timeUntilDeadline = deadline.getTime() - now.getTime()
        const hoursUntilDeadline = timeUntilDeadline / (1000 * 60 * 60)
        
        if (hoursUntilDeadline < 1) {
          slaStatus = 'warning'
          slaMessage = `Due in ${Math.round(hoursUntilDeadline * 60)} minutes`
        } else {
          slaStatus = 'warning'
          slaMessage = `Due in ${Math.round(hoursUntilDeadline)} hours`
        }
      } else if (hasProof) {
        slaStatus = 'ok'
        slaMessage = 'Proof uploaded'
      }
    }

    return {
      ...booking,
      proofCount,
      hasProof,
      slaStatus,
      slaMessage
    }
  }) || []

  const pendingBookings = bookingsWithStatus.filter(b => b.status === 'confirmed' || b.status === 'in_progress')
  const completedBookings = bookingsWithStatus.filter(b => b.status === 'completed')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Temple Operations</h1>
          <p className="text-muted-foreground mt-1">
            Manage today's bookings and ensure proof delivery
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{format(today, "EEEE, MMMM d, yyyy")}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingsWithStatus.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">With Proof</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {bookingsWithStatus.filter(b => b.hasProof).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">SLA Breached</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {bookingsWithStatus.filter(b => b.slaStatus === 'breached').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Pooja</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead>Pandit</TableHead>
                  <TableHead>Proof Status</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookingsWithStatus.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs">
                      {booking.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.services?.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {booking.profiles?.full_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.scheduled_start ? (
                        <div>
                          <div className="font-medium">
                            {format(new Date(booking.scheduled_start), "h:mm a")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(booking.scheduled_start), "MMM d")}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not scheduled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {booking.pandit_profiles?.profiles?.full_name ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.pandit_profiles.profiles.full_name}</span>
                        </div>
                      ) : (
                        <AssignPanditDialog bookingId={booking.id} />
                      )}
                    </TableCell>
                    <TableCell>
                      {booking.hasProof ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {booking.proofCount} proof{booking.proofCount > 1 ? 's' : ''}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          No proof
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {booking.slaStatus === 'breached' ? (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">Breached</span>
                        </div>
                      ) : booking.slaStatus === 'warning' ? (
                        <div className="flex items-center gap-1 text-amber-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs">{booking.slaMessage}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          {booking.slaMessage || 'On track'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        booking.status === 'completed' ? 'secondary' :
                        booking.status === 'in_progress' ? 'default' : 'outline'
                      }>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!booking.pandit_profiles?.profiles && (
                          <AssignPanditDialog bookingId={booking.id} />
                        )}
                        {booking.pandit_profiles?.profiles && !booking.hasProof && (
                          <UploadProofDialog bookingId={booking.id} />
                        )}
                        {booking.hasProof && booking.status !== 'completed' && (
                          <CompleteBookingDialog bookingId={booking.id} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!bookingsWithStatus || bookingsWithStatus.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No bookings scheduled for today
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


