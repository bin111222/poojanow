'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"
import { completeBookingTemple } from "./actions"

export function CompleteBookingDialog({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('bookingId', bookingId)
      
      await completeBookingTemple(formData)
      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error completing booking:', error)
      alert('Failed to complete booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Complete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Booking</DialogTitle>
          <DialogDescription>
            Mark this booking as completed. This will notify the user and generate the certificate.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-stone-200 bg-white text-stone-900 hover:bg-stone-100 hover:text-stone-900">
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? 'Completing...' : 'Mark as Completed'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

