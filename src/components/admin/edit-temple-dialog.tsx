"use client"

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Edit, 
  Loader2, 
  Building2, 
  MapPin, 
  Phone, 
  FileText, 
  Settings, 
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Sparkles,
  Info
} from "lucide-react"
import { updateTemple } from "@/app/admin/data/actions"
import { useToast } from "@/hooks/use-toast"

interface EditTempleDialogProps {
  temple: any
}

export function EditTempleDialog({ temple }: EditTempleDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useFormState(updateTemple, null)
  const { toast } = useToast()

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Temple updated",
        description: "Temple has been updated successfully.",
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
          <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl" />
            
            <DialogHeader className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-bold mb-2">Edit Temple</DialogTitle>
                    <DialogDescription className="text-white/90 text-base">
                      {temple.name}
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
                {temple.city && temple.state && (
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-semibold">{temple.city}, {temple.state}</span>
                  </div>
                )}
                {temple.deity && (
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-semibold">{temple.deity}</span>
                  </div>
                )}
                {temple.verified && (
                  <Badge variant="secondary" className="bg-green-500/30 text-white border-green-400/50 backdrop-blur-sm px-3 py-1.5">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1.5">
                  {temple.status || 'draft'}
                </Badge>
              </div>
            </DialogHeader>
          </div>

          <form action={formAction} className="flex flex-col h-full">
            <input type="hidden" name="templeId" value={temple.id} />
            
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-stone-50/50 to-white">
              <Tabs defaultValue="basic" className="w-full">
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-stone-200/50 px-6">
                  <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-transparent h-14 gap-2">
                    <TabsTrigger value="basic" className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-xl transition-all">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">Basic</span>
                    </TabsTrigger>
                    <TabsTrigger value="location" className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-xl transition-all">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Location</span>
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-xl transition-all">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Content</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-xl transition-all">
                      <Settings className="h-4 w-4" />
                      <span className="font-medium">Settings</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8 space-y-8">
                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-emerald-600" />
                        Temple Information
                      </h3>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-semibold text-stone-700">
                            Temple Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={temple.name}
                            required
                            className="h-12 border-2 border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="slug" className="text-sm font-semibold text-stone-700">
                            URL Slug <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="slug"
                            name="slug"
                            defaultValue={temple.slug}
                            required
                            placeholder="temple-name-url"
                            className="h-12 border-2 border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl font-mono"
                          />
                          <p className="text-xs text-stone-500 mt-2 flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            Used in the URL: /temples/[slug]
                          </p>
                        </div>
                      </div>

                      <Separator className="bg-stone-200 my-6" />

                      <div className="space-y-2">
                        <Label htmlFor="deity" className="text-sm font-semibold text-stone-700">
                          Deity
                        </Label>
                        <Input
                          id="deity"
                          name="deity"
                          defaultValue={temple.deity || ''}
                          placeholder="e.g., Shiva, Vishnu, Ganesh"
                          className="h-12 border-2 border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Location Tab */}
                  <TabsContent value="location" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Location Details
                      </h3>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-semibold text-stone-700">
                            City
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            defaultValue={temple.city || ''}
                            className="h-12 border-2 border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-sm font-semibold text-stone-700">
                            State
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            defaultValue={temple.state || ''}
                            className="h-12 border-2 border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
                          />
                        </div>
                      </div>

                      <Separator className="bg-stone-200 my-6" />

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-semibold text-stone-700">
                          Full Address
                        </Label>
                        <Textarea
                          id="address"
                          name="address"
                          defaultValue={temple.address || ''}
                          rows={3}
                          placeholder="Complete address with landmarks..."
                          className="border-2 border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold text-stone-700">
                          Contact Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          defaultValue={temple.phone || ''}
                          className="h-12 border-2 border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Content Tab */}
                  <TabsContent value="content" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-amber-600" />
                        Description & Content
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold text-stone-700">
                          Temple Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          defaultValue={temple.description || ''}
                          rows={8}
                          placeholder="Temple description, history, significance..."
                          className="border-2 border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl resize-none"
                        />
                        <p className="text-xs text-stone-500 mt-2">This will be displayed on the temple's public page</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-purple-600" />
                        Status & Visibility
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-semibold text-stone-700">
                          Publication Status
                        </Label>
                        <Select name="status" defaultValue={temple.status || 'draft'}>
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
                <Button 
                  type="submit" 
                  className="h-11 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all rounded-xl font-semibold"
                  disabled={state?.loading}
                >
                  {state?.loading ? (
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
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
