"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, CheckCircle2, Clock, IndianRupee, ArrowRight, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface PanditOption {
  service_id: string
  pandit_id: string
  pandit_name: string
  price: number
  temple_name: string | null
  temple_city: string | null
  temple_state: string | null
  duration_minutes: number | null
}

interface PoojaPanditsModalProps {
  poojaTitle: string
  poojaDescription: string | null
  durationMinutes: number | null
  pandits: PanditOption[]
  isOpen: boolean
  onClose: () => void
}

export function PoojaPanditsModal({
  poojaTitle,
  poojaDescription,
  durationMinutes,
  pandits,
  isOpen,
  onClose
}: PoojaPanditsModalProps) {
  // Sort pandits by price (lowest first)
  const sortedPandits = [...pandits].sort((a, b) => a.price - b.price)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">{poojaTitle}</DialogTitle>
          {poojaDescription && (
            <DialogDescription className="text-base mt-2">
              {poojaDescription}
            </DialogDescription>
          )}
          <div className="flex items-center gap-4 mt-4 text-sm text-stone-600">
            {durationMinutes && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{durationMinutes} minutes</span>
              </div>
            )}
            <Badge variant="secondary">
              {pandits.length} {pandits.length === 1 ? 'Pandit Available' : 'Pandits Available'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-900">Select a Pandit</h3>
            <p className="text-sm text-stone-500">Sorted by price (lowest first)</p>
          </div>

          <div className="space-y-3">
            {sortedPandits.map((pandit) => (
              <Link 
                key={pandit.service_id}
                href={`/book/${pandit.service_id}?panditId=${pandit.pandit_id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 border-2 border-stone-100 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary font-heading">
                        {pandit.pandit_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-stone-900">
                          {pandit.pandit_name}
                        </p>
                        <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      </div>
                      
                      {(pandit.temple_name || pandit.temple_city) && (
                        <div className="flex items-center gap-1 text-sm text-stone-600">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">
                            {pandit.temple_name && (
                              <>
                                {pandit.temple_name}
                                {pandit.temple_city && ', '}
                              </>
                            )}
                            {pandit.temple_city && (
                              <>
                                {pandit.temple_city}
                                {pandit.temple_state && `, ${pandit.temple_state}`}
                              </>
                            )}
                          </span>
                        </div>
                      )}
                      
                      {pandit.duration_minutes && (
                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{pandit.duration_minutes} minutes</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-6">
                    <div className="text-right">
                      <p className="font-bold text-lg text-stone-900">₹{pandit.price}</p>
                      <p className="text-xs text-stone-500">per pooja</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-sm hover:shadow-md transition-all flex-shrink-0"
                    >
                      Book Now
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


