"use client"

import { useState, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Edit, 
  Loader2, 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  FileText, 
  Settings, 
  Award,
  Star,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Shield,
  Save,
  X,
  Briefcase,
  Sparkles
} from "lucide-react"
import { updatePandit } from "@/app/admin/data/actions"
import { useToast } from "@/hooks/use-toast"

interface EditPanditDialogProps {
  pandit: any
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      className="h-11 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all rounded-xl font-semibold"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </>
      )}
    </Button>
  )
}

export function EditPanditDialog({ pandit }: EditPanditDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useFormState(updatePandit, null)
  const { toast } = useToast()
  const profile = pandit.profiles || {}

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Pandit updated",
        description: "Pandit profile has been updated successfully.",
      })
      setOpen(false)
    } else if (state?.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      })
    }
  }, [state, toast])

  const initials = profile.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'PD'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-5xl w-[95vw] max-h-[92vh] overflow-hidden p-0 gap-0 border-0 bg-transparent shadow-none"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200/50">
          {/* Elegant Header */}
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl" />
            
            <DialogHeader className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl ring-4 ring-white/10">
                    <AvatarImage src={pandit.profile_image_path} />
                    <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-3xl font-bold mb-2">{profile.full_name || 'Unknown Pandit'}</DialogTitle>
                    <DialogDescription className="text-white/90 text-base">
                      {pandit.city && pandit.state ? `${pandit.city}, ${pandit.state}` : 'Location not set'}
                    </DialogDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                {pandit.rating && (
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                    <span className="font-semibold">{pandit.rating.toFixed(1)} Rating</span>
                  </div>
                )}
                {pandit.total_bookings && (
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">{pandit.total_bookings} Bookings</span>
                  </div>
                )}
                {pandit.verification_status === 'verified' && (
                  <Badge variant="secondary" className="bg-green-500/30 text-white border-green-400/50 backdrop-blur-sm px-3 py-1.5">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1.5">
                  {pandit.profile_status || 'draft'}
                </Badge>
              </div>
            </DialogHeader>
          </div>

          <form action={formAction} className="flex flex-col h-full">
            <input type="hidden" name="panditId" value={pandit.id} />
            
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-stone-50/50 to-white">
              <Tabs defaultValue="profile" className="w-full">
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-stone-200/50 px-6">
                  <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-transparent h-14 gap-2">
                    <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">Contact</span>
                    </TabsTrigger>
                    <TabsTrigger value="professional" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all">
                      <Briefcase className="h-4 w-4" />
                      <span className="font-medium">Professional</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all">
                      <Settings className="h-4 w-4" />
                      <span className="font-medium">Settings</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8 space-y-8">
                  {/* Profile Tab */}
                  <TabsContent value="profile" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Personal Information
                      </h3>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="full_name" className="text-sm font-semibold text-stone-700">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            defaultValue={profile.full_name || ''}
                            required
                            className="h-12 border-2 border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold text-stone-700">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={profile.email || ''}
                            className="h-12 border-2 border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-stone-200" />

                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Biography
                      </h3>
                      <Textarea
                        id="bio"
                        name="bio"
                        defaultValue={pandit.bio || ''}
                        rows={6}
                        placeholder="Pandit biography and background..."
                        className="border-2 border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl resize-none"
                      />
                      <p className="text-xs text-stone-500 mt-2">This will be displayed on the pandit's public profile</p>
                    </div>
                  </TabsContent>

                  {/* Contact Tab */}
                  <TabsContent value="contact" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        Location & Contact
                      </h3>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-semibold text-stone-700">
                            City
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            defaultValue={pandit.city || ''}
                            className="h-12 border-2 border-stone-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-sm font-semibold text-stone-700">
                            State
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            defaultValue={pandit.state || ''}
                            className="h-12 border-2 border-stone-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-semibold text-stone-700">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            defaultValue={pandit.phone || ''}
                            className="h-12 border-2 border-stone-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Professional Tab */}
                  <TabsContent value="professional" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-600" />
                        Professional Details
                      </h3>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="years_of_experience" className="text-sm font-semibold text-stone-700">
                            Years of Experience
                          </Label>
                          <Input
                            id="years_of_experience"
                            name="years_of_experience"
                            type="number"
                            defaultValue={pandit.years_of_experience || 0}
                            min="0"
                            className="h-12 border-2 border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="rating" className="text-sm font-semibold text-stone-700">
                            Rating (0-5)
                          </Label>
                          <Input
                            id="rating"
                            name="rating"
                            type="number"
                            step="0.1"
                            defaultValue={pandit.rating || 0}
                            min="0"
                            max="5"
                            className="h-12 border-2 border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="total_bookings" className="text-sm font-semibold text-stone-700">
                            Total Bookings
                          </Label>
                          <Input
                            id="total_bookings"
                            name="total_bookings"
                            type="number"
                            defaultValue={pandit.total_bookings || 0}
                            min="0"
                            className="h-12 border-2 border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl"
                          />
                        </div>
                      </div>

                      <Separator className="bg-stone-200 my-6" />

                      <div className="space-y-2">
                        <Label htmlFor="specialties" className="text-sm font-semibold text-stone-700">
                          Specialties (comma-separated)
                        </Label>
                        <Input
                          id="specialties"
                          name="specialties"
                          defaultValue={pandit.specialties?.join(', ') || ''}
                          placeholder="e.g., Rudrabhishek, Ganesh Pooja, Vastu"
                          className="h-12 border-2 border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl"
                        />
                        <p className="text-xs text-stone-500 mt-2">Separate multiple specialties with commas</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-purple-600" />
                        Status & Verification
                      </h3>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="verification_status" className="text-sm font-semibold text-stone-700">
                            Verification Status
                          </Label>
                          <Select name="verification_status" defaultValue={pandit.verification_status || 'pending'}>
                            <SelectTrigger className="h-12 border-2 border-stone-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="verified">Verified</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="profile_status" className="text-sm font-semibold text-stone-700">
                            Profile Status
                          </Label>
                          <Select name="profile_status" defaultValue={pandit.profile_status || 'draft'}>
                            <SelectTrigger className="h-12 border-2 border-stone-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>

              {state?.error && (
                <div className="mx-8 mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">Error</p>
                    <p className="text-sm text-red-700 mt-1">{state.error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Elegant Footer */}
            <div className="border-t border-stone-200 bg-white p-6">
              <div className="flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="h-11 px-6 rounded-xl border-2 hover:bg-stone-50"
                >
                  Cancel
                </Button>
                <SubmitButton />
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
