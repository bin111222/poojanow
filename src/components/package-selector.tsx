'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, IndianRupee, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface PackageOffering {
  id: string
  title: string
  description: string | null
  quantity: number
  included: boolean
}

interface ServicePackage {
  id: string
  package_name: string
  package_description: string | null
  base_price_inr: number
  is_popular: boolean
  is_recommended: boolean
  offerings: PackageOffering[]
}

interface PackageSelectorProps {
  packages: ServicePackage[]
  selectedPackageId: string | null
  onSelectPackage: (packageId: string) => void
  serviceBasePrice?: number
}

export function PackageSelector({ 
  packages, 
  selectedPackageId, 
  onSelectPackage,
  serviceBasePrice = 0 
}: PackageSelectorProps) {
  if (!packages || packages.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-stone-900 mb-1">Choose Your Package</h3>
        <p className="text-sm text-muted-foreground">Select a package that best suits your needs</p>
      </div>

      <div className="space-y-4">
        {packages.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id
          const savings = serviceBasePrice > 0 && pkg.base_price_inr < serviceBasePrice
            ? Math.round(((serviceBasePrice - pkg.base_price_inr) / serviceBasePrice) * 100)
            : 0

          return (
            <Card
              key={pkg.id}
              className={cn(
                "relative cursor-pointer transition-all hover:shadow-lg border-2",
                isSelected && "ring-2 ring-primary border-primary shadow-lg",
                !isSelected && "border-stone-200"
              )}
              onClick={() => onSelectPackage(pkg.id)}
            >
              {pkg.is_popular && (
                <div className="absolute -top-3 right-3">
                  <Badge className="bg-primary text-white px-2.5 py-1 text-xs font-semibold">
                    <Star className="h-3 w-3 mr-1" /> Most Popular
                  </Badge>
                </div>
              )}

              {pkg.is_recommended && !pkg.is_popular && (
                <div className="absolute -top-3 right-3">
                  <Badge variant="secondary" className="px-2.5 py-1 text-xs">
                    Recommended
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-3 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <CardTitle className="text-xl font-bold">{pkg.package_name}</CardTitle>
                  </div>
                </div>
                {pkg.package_description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{pkg.package_description}</p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price and Offerings in a row for vertical layout */}
                <div className="flex items-start justify-between gap-4">
                  {/* Price */}
                  <div className="flex items-baseline gap-2 flex-shrink-0">
                    <span className="text-2xl font-bold text-stone-900 flex items-center">
                      <IndianRupee className="h-5 w-5" /> {pkg.base_price_inr.toLocaleString()}
                    </span>
                    {savings > 0 && (
                      <span className="text-sm text-green-600 font-semibold">
                        Save {savings}%
                      </span>
                    )}
                  </div>

                  {/* Included Offerings */}
                  {pkg.offerings && pkg.offerings.length > 0 && (
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                        What's Included:
                      </p>
                      <ul className="space-y-1.5">
                        {pkg.offerings
                          .filter(o => o.included)
                          .map((offering, idx) => (
                            <li key={offering.id || idx} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-stone-700">
                                {offering.quantity > 1 && `${offering.quantity}x `}
                                {offering.title}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Select Button */}
                <Button
                  type="button"
                  className={cn(
                    "w-full rounded-full font-medium",
                    isSelected 
                      ? "bg-primary hover:bg-primary/90 text-white shadow-md" 
                      : "bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectPackage(pkg.id)
                  }}
                >
                  {isSelected ? "Selected" : "Select Package"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

