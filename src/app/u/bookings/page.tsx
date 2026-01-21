import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function UserBookingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      services (title),
      temples (name),
      pandit_profiles:pandit_id (
        profiles:id (full_name)
      )
    `)
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Link href="/temples">
          <Button>New Booking</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.services?.title}
                  {booking.temples && (
                    <div className="text-xs text-muted-foreground">
                      {booking.temples.name}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {booking.scheduled_at 
                    ? format(new Date(booking.scheduled_at), "PPP p")
                    : "Not Scheduled"}
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
                <TableCell>
                  ₹{booking.total_amount}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/u/booking/${booking.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {(!bookings || bookings.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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

