'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { IndianRupee, Clock, Shield, CheckCircle2, Sparkles, Gift } from "lucide-react"

interface OrderSummaryProps {
  service: {
    title: string
    description: string | null
    base_price_inr: number
    duration_minutes: number | null
    service_type?: string
  }
  temple?: {
    name: string
    city: string
  } | null
  selectedPackagePrice?: number | null
  selectedPackageName?: string | null
}

export function OrderSummary({ 
  service, 
  temple, 
  selectedPackagePrice,
  selectedPackageName 
}: OrderSummaryProps) {
  const totalPrice = selectedPackagePrice || service.base_price_inr

  return (
    <Card className="shadow-xl sticky top-24 border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-orange-50 border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Booking Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div>
          <h3 className="font-bold text-lg text-stone-900 mb-1">{service.title}</h3>
          {selectedPackageName && (
            <Badge variant="secondary" className="mb-2">
              {selectedPackageName} Package
            </Badge>
          )}
          {service.description && (
            <p className="text-sm text-stone-600 mt-1 line-clamp-2">{service.description}</p>
          )}
        </div>

        {temple && (
          <div className="bg-stone-50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Temple</p>
            <p className="text-sm font-medium text-stone-900">{temple.name}</p>
            <p className="text-xs text-stone-600">{temple.city}</p>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          {service.duration_minutes && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-stone-600">
                <Clock className="h-4 w-4" />
                <span>Duration</span>
              </div>
              <span className="font-semibold text-stone-900">{service.duration_minutes} minutes</span>
            </div>
          )}

          {service.service_type && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600">Service Type</span>
              <Badge variant="outline" className="text-xs">
                {service.service_type}
              </Badge>
            </div>
          )}
        </div>

        <Separator />

        {/* What You Get */}
        <div className="bg-primary/5 p-4 rounded-lg space-y-2">
          <p className="text-xs font-semibold text-stone-700 uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            What You'll Receive
          </p>
          <ul className="space-y-1.5 text-xs text-stone-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
              <span>Live pooja performance</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
              <span>Photo & video proof</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
              <span>Digital certificate</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
              <span>Complete samagri</span>
            </li>
          </ul>
        </div>

        <Separator />

        {/* Total */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-stone-900">Total Amount</span>
            <span className="text-3xl font-bold text-primary flex items-center">
              <IndianRupee className="h-6 w-6" />
              {totalPrice.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-stone-500 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Secure payment via Razorpay
          </p>
        </div>

        {/* Trust Badge */}
        <div className="pt-4 border-t border-stone-200">
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>100% Money-back guarantee if service not completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

