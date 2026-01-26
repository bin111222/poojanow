"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, IndianRupee, MapPin, CheckCircle2, ArrowRight } from "lucide-react"
import { PoojaPanditsModal } from "@/components/pooja-pandits-modal"

interface PoojaGroup {
  title: string
  description: string | null
  duration_minutes: number | null
  event_type: {
    name: string
    slug: string
  }
  pandits: Array<{
    service_id: string
    pandit_id: string
    pandit_name: string
    price: number
    temple_name: string | null
    temple_city: string | null
    temple_state: string | null
    duration_minutes: number | null
  }>
}

export function PoojaGroupCard({ pooja }: { pooja: PoojaGroup }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get price range
  const prices = pooja.pandits.map(p => p.price).sort((a, b) => a - b)
  const minPrice = prices[0]
  const maxPrice = prices[prices.length - 1]
  const priceRange = minPrice === maxPrice 
    ? `₹${minPrice}` 
    : `₹${minPrice} - ₹${maxPrice}`

  return (
    <>
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setIsModalOpen(true)}
    >
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{pooja.title}</CardTitle>
            {pooja.description && (
              <p className="text-sm text-stone-600 line-clamp-2 mb-3">
                {pooja.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-stone-500">
              {pooja.duration_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{pooja.duration_minutes} mins</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                <span className="font-medium text-stone-700">{priceRange}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {pooja.pandits.length} {pooja.pandits.length === 1 ? 'Pandit' : 'Pandits'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-stone-700 mb-3">
            Available Pandits:
          </h4>
          {pooja.pandits.slice(0, 3).map((pandit) => (
            <Link 
              key={pandit.service_id}
              href={`/book/${pandit.service_id}?panditId=${pandit.pandit_id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 border-2 border-stone-100">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-heading">
                      {pandit.pandit_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-stone-900 truncate">
                        {pandit.pandit_name}
                      </p>
                      <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    </div>
                    {pandit.temple_name && (
                      <div className="flex items-center gap-1 text-xs text-stone-500">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">
                          {pandit.temple_name}
                          {pandit.temple_city && `, ${pandit.temple_city}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <p className="font-semibold text-stone-900">₹{pandit.price}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-sm hover:shadow-md transition-all"
                  >
                    Book
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
          {pooja.pandits.length > 3 && (
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsModalOpen(true)
                }}
              >
                View {pooja.pandits.length - 3} more pandit{pooja.pandits.length - 3 === 1 ? '' : 's'}
              </Button>
            </div>
          )}
          {pooja.pandits.length <= 3 && (
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsModalOpen(true)
                }}
              >
                View All {pooja.pandits.length} Pandit{pooja.pandits.length === 1 ? '' : 's'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <PoojaPanditsModal
        poojaTitle={pooja.title}
        poojaDescription={pooja.description}
        durationMinutes={pooja.duration_minutes}
        pandits={pooja.pandits}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
    </>
  )
}

