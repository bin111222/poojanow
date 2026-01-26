'use client'

import { useState } from "react"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ProofUploadProps {
  bookingId: string
  onUploadSuccess?: () => void
}

export function ProofUpload({ bookingId, onUploadSuccess }: ProofUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or video file.",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      })
      return
    }

    setFile(selectedFile)

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    try {
      // Get signed upload URL
      const response = await fetch('/api/proof/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          fileName: file.name,
          fileType: file.type
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { uploadUrl, path } = await response.json()

      // Upload file to Supabase storage
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      // Save proof record
      const saveResponse = await fetch('/api/proof/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          storagePath: path,
          mediaType: file.type.startsWith('image/') ? 'image' : 'video'
        })
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save proof record')
      }

      toast({
        title: "Proof uploaded successfully",
        description: "Your proof has been uploaded and is pending approval."
      })

      setFile(null)
      setPreview(null)
      onUploadSuccess?.()
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <label className="block">
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium mb-1">Click to upload proof</span>
            <span className="text-xs">Image or video (max 10MB)</span>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileSelect}
          />
        </label>
      ) : (
        <div className="relative border rounded-md p-4">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full mt-4"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Proof
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

