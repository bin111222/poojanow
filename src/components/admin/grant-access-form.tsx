"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { grantAdminAccess } from "@/app/admin/grant-access/actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface GrantAccessFormProps {
  email?: string
}

export function GrantAccessForm({ email: initialEmail }: GrantAccessFormProps) {
  const [email, setEmail] = useState(initialEmail || '')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🟢 [FORM] Submit clicked', { email })
    
    if (!email) {
      console.error('🟢 [FORM] No email provided')
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    console.log('🟢 [FORM] Starting transition...')
    startTransition(async () => {
      try {
        console.log('🟢 [FORM] Creating FormData...')
        const formData = new FormData()
        formData.append('email', email)
        console.log('🟢 [FORM] FormData created, calling grantAdminAccess...')
        
        const result = await grantAdminAccess(formData)
        console.log('🟢 [FORM] Result received:', result)
        
        if (result?.error) {
          console.error('🟢 [FORM] Error in result:', result.error)
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
            duration: 10000, // Show longer for detailed errors
          })
        } else if (result?.success) {
          console.log('🟢 [FORM] Success! Redirecting...')
          toast({
            title: "Success!",
            description: result.message || "Admin access granted successfully",
          })
          // Refresh the page after a short delay
          setTimeout(() => {
            console.log('🟢 [FORM] Redirecting to /admin/data')
            window.location.href = '/admin/data'
          }, 1500)
        } else {
          console.error('🟢 [FORM] No result or unknown state:', result)
          toast({
            title: "Unknown Error",
            description: "No response from server. Check console for details.",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        console.error('🟢 [FORM] Exception caught:', error)
        toast({
          title: "Unexpected Error",
          description: error.message || "Something went wrong",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
          disabled={isPending || !!initialEmail}
        />
        {initialEmail && (
          <p className="text-xs text-stone-500">This is your current email</p>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Granting Access...
          </>
        ) : (
          "Grant Admin Access"
        )}
      </Button>
    </form>
  )
}

