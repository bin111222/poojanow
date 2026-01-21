import { createClient } from "@/utils/supabase/server"
import { BookingActions } from "./booking-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default async function AdminBookingsPage() {
  const supabase = createClient()
  
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      services (title),
      profiles:user_id (full_name, email),
      pandit_profiles:pandit_id (
        profiles:id (full_name)
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">All Bookings</h1>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Pandit</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {booking.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div className="font-medium">{booking.profiles?.full_name}</div>
                  <div className="text-xs text-muted-foreground">{booking.profiles?.email}</div>
                </TableCell>
                <TableCell>{booking.services?.title}</TableCell>
                <TableCell>
                    {booking.pandit_profiles?.profiles?.full_name || <span className="text-muted-foreground italic">Unassigned</span>}
                </TableCell>
                <TableCell>
                  {booking.scheduled_at 
                    ? format(new Date(booking.scheduled_at), "MMM d, yyyy")
                    : "-"}
                </TableCell>
                <TableCell>
                   <Badge variant={
                        booking.status === 'confirmed' ? 'default' : 
                        booking.status === 'completed' ? 'secondary' : 
                        booking.status === 'cancelled' ? 'destructive' : 'outline'
                   }>
                        {booking.status}
                   </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <BookingActions bookingId={booking.id} status={booking.status} />
                </TableCell>
              </TableRow>
            ))}
            {(!bookings || bookings.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

