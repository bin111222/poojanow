'use client'

import { verifyPandit, rejectPandit } from "./actions"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Check, X, Loader2 } from "lucide-react"

export function PanditActionButtons({ panditId }: { panditId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function onVerify() {
    setIsLoading(true)
    const result = await verifyPandit(panditId)
    setIsLoading(false)

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Verified", description: "Pandit profile approved." })
    }
  }

  async function onReject() {
    setIsLoading(true)
    const result = await rejectPandit(panditId)
    setIsLoading(false)

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Rejected", description: "Pandit profile rejected." })
    }
  }

  return (
    <div className="flex gap-2 justify-end">
      <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={onVerify} disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      </Button>
      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onReject} disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
      </Button>
    </div>
  )
}

