'use client'

import { useRouter } from 'next/navigation'
import { ProofUpload } from './proof-upload'

interface ProofUploadWrapperProps {
  bookingId: string
}

export function ProofUploadWrapper({ bookingId }: ProofUploadWrapperProps) {
  const router = useRouter()

  const handleUploadSuccess = () => {
    router.refresh()
  }

  return <ProofUpload bookingId={bookingId} onUploadSuccess={handleUploadSuccess} />
}

