'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User } from "lucide-react"
import { assignPandit } from "./actions"

export function AssignPanditDialog({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false)
  const [panditId, setPanditId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [pandits, setPandits] = useState<any[]>([])

  const loadPandits = async () => {
    try {
      const response = await fetch('/api/temple/pandits')
      if (response.ok) {
        const data = await response.json()
        setPandits(data.pandits || [])
      }
    } catch (error) {
      console.error('Error loading pandits:', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      loadPandits()
    }
  }

  const handleAssign = async () => {
    if (!panditId) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('bookingId', bookingId)
      formData.append('panditId', panditId)
      
      await assignPandit(formData)
      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error assigning pandit:', error)
      alert('Failed to assign pandit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-stone-200 bg-white text-stone-900 hover:bg-stone-100 hover:text-stone-900">
          <User className="h-4 w-4 mr-1" />
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Pandit</DialogTitle>
          <DialogDescription>
            Select a pandit to assign to this booking
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select value={panditId} onValueChange={setPanditId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a pandit" />
            </SelectTrigger>
            <SelectContent>
              {pandits.map((pandit) => (
                <SelectItem key={pandit.id} value={pandit.id}>
                  {pandit.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-stone-200 bg-white text-stone-900 hover:bg-stone-100 hover:text-stone-900">
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!panditId || loading}>
            {loading ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

