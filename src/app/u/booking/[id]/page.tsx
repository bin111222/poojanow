import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, MapPin, User } from "lucide-react"

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      services (title, description, duration_minutes),
      temples (name, address, city, state),
      pandit_profiles:pandit_id (
        profiles:id (full_name, phone)
      )
    `)
    .eq("id", params.id)
    .eq("user_id", user!.id)
    .single()

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
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled Date:</span>
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
            <Card className="md:col-span-2 border-green-200 bg-green-50">
                <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Pooja Completed
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-green-700 mb-4">
                        This service has been completed. You can view the proof of completion below.
                    </p>
                    <Button variant="outline" className="bg-white border-green-200 text-green-700 hover:bg-green-100">
                        View Proof
                    </Button>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}

