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
import { Upload } from "lucide-react"
import { ProofUpload } from "@/components/proof-upload"

export function UploadProofDialog({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false)

  const handleUploadSuccess = () => {
    setOpen(false)
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-stone-200 bg-white text-stone-900 hover:bg-stone-100 hover:text-stone-900">
          <Upload className="h-4 w-4 mr-1" />
          Upload Proof
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Proof</DialogTitle>
          <DialogDescription>
            Upload photo or video proof of the pooja being performed
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ProofUpload bookingId={bookingId} onUploadSuccess={handleUploadSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

