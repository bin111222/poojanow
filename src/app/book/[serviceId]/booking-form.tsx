'use client'

import { useState } from "react"
import { useFormState } from "react-dom"
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

const initialState = {
  error: '',
}

export function BookingForm({ service }: { service: any }) {
  const [date, setDate] = useState<Date>()
  const [state, formAction] = useFormState(createBooking, initialState)

  // Generate simple time slots for demo (9 AM to 5 PM)
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"
  ]

  return (
    <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
      <input type="hidden" name="serviceId" value={service.id} />
      <input type="hidden" name="price" value={service.base_price_inr} />
      
      {/* Date Selection */}
      <div className="space-y-2">
        <Label>Select Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
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
        <Select name="time" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a time slot" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
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

      <Button type="submit" className="w-full" disabled={!date}>
        Confirm & Pay
      </Button>
    </form>
  )
}
