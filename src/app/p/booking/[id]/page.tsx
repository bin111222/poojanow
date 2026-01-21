import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { completeBooking } from "../actions"
import { CheckCircle2, Clock, MapPin, User, Upload } from "lucide-react"

export default async function PanditBookingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      services (title, description, duration_minutes),
      temples (name, address, city, state),
      profiles:user_id (full_name, email, phone)
    `)
    .eq("id", params.id)
    .eq("pandit_id", user!.id)
    .single()

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
            
            <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">
                        {booking.scheduled_at ? format(new Date(booking.scheduled_at), "PPP") : "TBD"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">
                        {booking.scheduled_at ? format(new Date(booking.scheduled_at), "p") : "TBD"}
                    </span>
                </div>
            </div>
          </CardContent>
        </Card>

        {booking.status === 'confirmed' && (
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={completeBooking} className="flex flex-col sm:flex-row gap-4 items-end">
                        <input type="hidden" name="bookingId" value={booking.id} />
                        
                        <div className="w-full sm:w-auto flex-1">
                            <label className="block text-sm font-medium mb-2">Upload Proof (Photo/Video)</label>
                            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 mb-2" />
                                <span className="text-sm">Click to upload proof</span>
                                <input type="file" className="hidden" /> 
                                {/* Note: Real file upload requires client component + storage logic. 
                                    For this demo, clicking "Complete" simulates it. */}
                            </div>
                        </div>

                        <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark as Completed
                        </Button>
                    </form>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}

