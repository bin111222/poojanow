'use client'

import { updateTempleStatus } from "../actions"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function TempleStatusToggle({ templeId, initialStatus }: { templeId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function onToggle(checked: boolean) {
    const newStatus = checked ? 'published' : 'draft'
    setIsLoading(true)
    
    // Optimistic update
    setStatus(newStatus)

    const result = await updateTempleStatus(templeId, newStatus)

    setIsLoading(false)

    if (result?.error) {
      setStatus(initialStatus) // Revert
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Status Updated",
        description: `Temple is now ${newStatus}`,
      })
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id={`status-${templeId}`} 
        checked={status === 'published'}
        onCheckedChange={onToggle}
        disabled={isLoading}
      />
      <Label htmlFor={`status-${templeId}`}>
        {status === 'published' ? 'Published' : 'Draft'}
      </Label>
    </div>
  )
}

