'use client'

import { useState, useEffect } from "react"
import { BookingForm } from "./booking-form"
import { OrderSummary } from "@/components/order-summary"
import { BookingHeroSection } from "@/components/booking-hero-section"

export function BookingPageClient({ 
  service, 
  packages, 
  temple,
  pandit,
  eventType
}: { 
  service: any
  packages: any[]
  temple: { name: string; city: string } | null
  pandit: any
  eventType: any
}) {
  // Initialize with recommended package or first package if available
  const initialPackage = packages.length > 0 
    ? packages.find(p => p.is_recommended) || packages[0]
    : null

  const [selectedPackagePrice, setSelectedPackagePrice] = useState<number | null>(
    initialPackage ? initialPackage.base_price_inr : null
  )
  const [selectedPackageName, setSelectedPackageName] = useState<string | null>(
    initialPackage ? initialPackage.package_name : null
  )

  const handlePackageChange = (packageId: string | null, price: number, name: string | null) => {
    setSelectedPackagePrice(price)
    setSelectedPackageName(name)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section with Pandit & Event Details */}
      <BookingHeroSection 
        service={service}
        pandit={pandit}
        temple={temple}
        eventType={eventType}
      />

      {/* Booking Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Booking Form with Package Selection */}
        <div className="order-1 lg:order-1 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Complete Your Booking</h2>
            <p className="text-stone-600">Select your preferred date, time, and package</p>
          </div>
          <BookingForm 
            service={service} 
            packages={packages}
            onPackageChange={handlePackageChange}
          />
        </div>

        {/* Order Summary */}
        <div className="order-2 lg:order-2">
          <OrderSummary 
            service={service}
            temple={temple}
            selectedPackagePrice={selectedPackagePrice}
            selectedPackageName={selectedPackageName}
          />
        </div>
      </div>
    </div>
  )
}

