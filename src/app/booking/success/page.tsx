import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, ArrowRight } from "lucide-react"

export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { bookingId?: string; payment_id?: string }
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-stone-100">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-in zoom-in duration-300">
            <CheckCircle2 className="h-10 w-10" />
        </div>
        
        <h1 className="font-heading text-3xl font-bold text-stone-900 mb-2">Booking Confirmed!</h1>
        <p className="text-stone-600 mb-8">
            Your pooja has been successfully scheduled. May this bring peace and prosperity to you and your family.
        </p>

        <div className="bg-stone-50 rounded-xl p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium text-stone-900">What happens next?</span>
            </div>
            <ul className="text-sm text-stone-600 space-y-2 ml-8 list-disc">
                <li>You will receive a confirmation email shortly.</li>
                <li>The pandit may contact you for specific sankalp details.</li>
                <li>You can track the status in your dashboard.</li>
            </ul>
        </div>

        <div className="space-y-3">
            <Link href={`/u/booking/${searchParams.bookingId}`}>
                <Button className="w-full h-12 rounded-full text-base bg-primary hover:bg-orange-700">
                    View Booking Details
                </Button>
            </Link>
            <Link href="/">
                <Button variant="ghost" className="w-full h-12 rounded-full text-stone-500 hover:text-stone-900">
                    Return to Home
                </Button>
            </Link>
        </div>
      </div>
    </div>
  )
}

