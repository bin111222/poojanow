'use client'

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { createBooking } from "../actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    Razorpay: any
  }
}

const initialState = {
  error: '',
}

export function BookingForm({ service }: { service: any }) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [state, formAction] = useFormState(createBooking, initialState)
  const router = useRouter()
  const { toast } = useToast()

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Handle booking creation and payment
  useEffect(() => {
    if (state?.success && state?.bookingId) {
      handlePayment(state.bookingId)
    }
  }, [state])

  const handlePayment = async (bookingId: string) => {
    if (!window.Razorpay) {
      toast({
        title: "Payment Error",
        description: "Payment gateway not loaded. Please refresh and try again.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      // Create Razorpay order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          amount: service.base_price_inr,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment order')
      }

      const orderData = await response.json()

      // Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PoojaNow',
        description: `Payment for ${service.title}`,
        order_id: orderData.orderId,
        handler: function (response: any) {
          // Payment successful - redirect to success page
          // Webhook will verify and update booking status
          router.push(`/booking/success?bookingId=${bookingId}&payment_id=${response.razorpay_payment_id}`)
        },
        prefill: {
          // You can prefill user details here if available
        },
        theme: {
          color: '#ea580c', // Primary color
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment. Your booking is still pending.",
            })
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response: any) {
        setLoading(false)
        toast({
          title: "Payment Failed",
          description: response.error.description || "Payment could not be processed.",
          variant: "destructive"
        })
      })

      razorpay.open()
    } catch (error: any) {
      setLoading(false)
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!date || !time) {
      toast({
        title: "Validation Error",
        description: "Please select both date and time.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formAction(formData)
  }

  // Generate simple time slots for demo (9 AM to 5 PM)
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-lg">
      <input type="hidden" name="serviceId" value={service.id} />
      <input type="hidden" name="price" value={service.base_price_inr} />
      <input type="hidden" name="durationMinutes" value={service.duration_minutes || 45} />
      
      {/* Date Selection */}
      <div className="space-y-2">
        <Label>Select Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
        <input type="hidden" name="date" value={date ? format(date, "yyyy-MM-dd") : ""} />
      </div>

      {/* Time Selection */}
      <div className="space-y-2">
        <Label>Select Time</Label>
        <Select name="time" required value={time} onValueChange={setTime}>
          <SelectTrigger>
            <SelectValue placeholder="Select a time slot" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((timeSlot) => (
              <SelectItem key={timeSlot} value={timeSlot}>
                {timeSlot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Special Requests / Sankalp Details</Label>
        <Textarea 
            id="notes" 
            name="notes" 
            placeholder="Please mention names and gothra for the pooja..." 
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={!date || !time || loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Confirm & Pay'
        )}
      </Button>
    </form>
  )
}
