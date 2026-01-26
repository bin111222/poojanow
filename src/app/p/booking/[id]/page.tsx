import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { completeBooking } from "../../actions"
import { ProofUploadWrapper } from "@/components/proof-upload-wrapper"
import { CheckCircle2, Clock, MapPin, User, AlertCircle } from "lucide-react"

export default async function PanditBookingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      services (title, description, duration_minutes),
      temples (name, address, city, state),
      profiles:user_id (full_name, email, phone),
      booking_proofs (id, status, created_at)
    `)
    .eq("id", params.id)
    .eq("pandit_id", user!.id)
    .single()

  // Get proof count
  const proofCount = booking?.booking_proofs?.filter((p: any) => p.status === 'uploaded' || p.status === 'approved').length || 0

  if (!booking) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Booking Management</h1>
        <Badge className="text-base px-4 py-1" variant={
            booking.status === 'confirmed' ? 'default' : 
            booking.status === 'completed' ? 'secondary' : 'outline'
        }>
            {booking.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                    <p className="font-medium">{booking.profiles?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{booking.profiles?.email}</p>
                </div>
            </div>
            {booking.notes && (
                <div className="bg-muted p-3 rounded-md text-sm mt-2">
                    <span className="font-semibold block mb-1">Notes:</span>
                    {booking.notes}
                </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{booking.services?.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="h-4 w-4" />
                <span>{booking.services?.duration_minutes} mins</span>
              </div>
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
                    <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Date:</span>
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

        {booking.status === 'confirmed' && (
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Upload Proof (Photo/Video)</label>
                        <p className="text-xs text-muted-foreground mb-3">
                            Minimum 1 proof required before completion. Upload photos or videos of the pooja being performed.
                        </p>
                        <ProofUploadWrapper bookingId={booking.id} />
                        {proofCount > 0 && (
                            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                {proofCount} proof{proofCount > 1 ? 's' : ''} uploaded
                            </p>
                        )}
                    </div>

                    <form action={completeBooking}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <Button 
                            type="submit" 
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={proofCount < 1}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {proofCount < 1 ? (
                                <>Upload proof first to complete</>
                            ) : (
                                <>Mark as Completed</>
                            )}
                        </Button>
                        {proofCount < 1 && (
                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                At least 1 proof photo is required
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}

