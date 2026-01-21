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

export default async function PanditBookingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      services (title),
      profiles:user_id (full_name)
    `)
    .eq("pandit_id", user!.id)
    .order("scheduled_at", { ascending: true })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Bookings</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.profiles?.full_name}
                </TableCell>
                <TableCell>
                  {booking.services?.title}
                </TableCell>
                <TableCell>
                  {booking.scheduled_at 
                    ? format(new Date(booking.scheduled_at), "PPP p")
                    : "Not Scheduled"}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    booking.status === 'confirmed' ? 'default' : 
                    booking.status === 'completed' ? 'secondary' : 'outline'
                  }>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/p/booking/${booking.id}`}>
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {(!bookings || bookings.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No bookings assigned yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

