'use client'

import { cancelBookingAdmin, refundBookingAdmin } from "./actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Ban, RotateCcw, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function BookingActions({ bookingId, status }: { bookingId: string, status: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function onCancel() {
    if (!confirm("Are you sure you want to cancel this booking?")) return
    
    setIsLoading(true)
    const result = await cancelBookingAdmin(bookingId)
    setIsLoading(false)

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Cancelled", description: "Booking has been cancelled." })
    }
  }

  async function onRefund() {
    if (!confirm("Are you sure you want to refund this booking? This cannot be undone.")) return

    setIsLoading(true)
    const result = await refundBookingAdmin(bookingId)
    setIsLoading(false)

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Refunded", description: "Booking has been refunded." })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {status !== 'cancelled' && status !== 'refunded' && (
            <DropdownMenuItem onClick={onCancel} className="text-red-600 focus:text-red-600">
                <Ban className="mr-2 h-4 w-4" /> Cancel Booking
            </DropdownMenuItem>
        )}
        {status === 'confirmed' || status === 'completed' ? (
            <DropdownMenuItem onClick={onRefund} className="text-orange-600 focus:text-orange-600">
                <RotateCcw className="mr-2 h-4 w-4" /> Issue Refund
            </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

