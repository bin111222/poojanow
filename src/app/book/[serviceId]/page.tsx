import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { BookingForm } from "./booking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee, Clock, CalendarIcon } from "lucide-react"

export default async function BookingPage({ 
  params,
  searchParams 
}: { 
  params: { serviceId: string },
  searchParams: { panditId?: string, templeId?: string }
}) {
  const supabase = createClient()
  
  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?next=/book/${params.serviceId}`)
  }

  // Fetch Service Details - Only allow active single pooja (Phase 1)
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select(`
      *,
      temples (name, city)
    `)
    .eq("id", params.serviceId)
    .eq("is_active_single_pooja", true)
    .eq("status", "published")
    .single()

  if (serviceError) {
    console.error('Service fetch error:', serviceError)
    notFound()
  }

  if (!service) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-stone-900">Complete Your Booking</h1>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-stone-900">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  {service.temples && !Array.isArray(service.temples) && (
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Temple:</span>
                       <span className="font-medium text-stone-900">{service.temples.name}, {service.temples.city}</span>
                     </div>
                  )}
                  {service.duration_minutes && (
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Duration:</span>
                       <span className="font-medium flex items-center text-stone-900">
                          <Clock className="h-3 w-3 mr-1" /> {service.duration_minutes} mins
                       </span>
                     </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t mt-2">
                    <span className="text-stone-900">Total:</span>
                    <span className="flex items-center text-primary">
                      <IndianRupee className="h-4 w-4 mr-1" /> {service.base_price_inr}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="order-1 lg:order-2">
             <BookingForm service={service} />
          </div>
        </div>
      </div>
    </div>
  )
}

