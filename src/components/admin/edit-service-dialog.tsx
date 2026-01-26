"use client"

import { useState, useEffect, useRef } from "react"
import { useFormState } from "react-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Edit, 
  Loader2, 
  Sparkles, 
  IndianRupee, 
  Clock, 
  FileText, 
  Settings, 
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Save,
  X,
  Tag,
  Info
} from "lucide-react"
import { updateService } from "@/app/admin/data/actions"
import { useToast } from "@/hooks/use-toast"

interface EditServiceDialogProps {
  service: any
}

export function EditServiceDialog({ service }: EditServiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useFormState(updateService, null)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [isActiveSinglePooja, setIsActiveSinglePooja] = useState(service.is_active_single_pooja || false)
  const [isEventBased, setIsEventBased] = useState(service.event_category === 'event_based')

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Service updated",
        description: "Service has been updated successfully.",
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
        className="max-w-4xl w-[95vw] max-h-[92vh] overflow-hidden p-0 gap-0 border-0 bg-transparent shadow-none"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200/50">
          {/* Elegant Header */}
          <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-8 text-white">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl" />
            
            <DialogHeader className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-bold mb-2">Edit Service</DialogTitle>
                    <DialogDescription className="text-white/90 text-base">
                      {service.title}
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
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  <span className="font-semibold">₹{service.base_price_inr?.toLocaleString() || 0}</span>
                </div>
                {service.duration_minutes && (
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">{service.duration_minutes} min</span>
                  </div>
                )}
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1.5">
                  {service.status || 'draft'}
                </Badge>
              </div>
            </DialogHeader>
          </div>

          <form ref={formRef} action={formAction} className="flex flex-col h-full">
            <input type="hidden" name="serviceId" value={service.id} />
            <input type="hidden" name="is_active_single_pooja" value={isActiveSinglePooja ? 'on' : 'off'} />
            <input type="hidden" name="event_category" value={isEventBased ? 'on' : 'off'} />
            
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-stone-50/50 to-white">
              <Tabs defaultValue="basic" className="w-full">
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-stone-200/50 px-6">
                  <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-transparent h-14 gap-2">
                    <TabsTrigger value="basic" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl transition-all">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Basic</span>
                    </TabsTrigger>
                    <TabsTrigger value="pricing" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl transition-all">
                      <IndianRupee className="h-4 w-4" />
                      <span className="font-medium">Pricing</span>
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl transition-all">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Content</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl transition-all">
                      <Settings className="h-4 w-4" />
                      <span className="font-medium">Settings</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8 space-y-8">
                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-6 mt-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-orange-600" />
                          Service Information
                        </h3>
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-semibold text-stone-700">
                              Service Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="title"
                              name="title"
                              defaultValue={service.title}
                              required
                              placeholder="e.g., Rudrabhishek Pooja"
                              className="h-12 border-2 border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="service_type" className="text-sm font-semibold text-stone-700">
                              Service Type <span className="text-red-500">*</span>
                            </Label>
                            <Select name="service_type" defaultValue={service.service_type || 'pooja'}>
                              <SelectTrigger className="h-12 border-2 border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pooja">Pooja</SelectItem>
                                <SelectItem value="consult">Consultation</SelectItem>
                                <SelectItem value="live_darshan">Live Darshan</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-stone-200" />

                      <div>
                        <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-orange-600" />
                          Duration & Status
                        </h3>
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="duration_minutes" className="text-sm font-semibold text-stone-700">
                              Duration (minutes)
                            </Label>
                            <Input
                              id="duration_minutes"
                              name="duration_minutes"
                              type="number"
                              defaultValue={service.duration_minutes || 60}
                              min="0"
                              className="h-12 border-2 border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm font-semibold text-stone-700">
                              Status <span className="text-red-500">*</span>
                            </Label>
                            <Select name="status" defaultValue={service.status || 'draft'}>
                              <SelectTrigger className="h-12 border-2 border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl">
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
                    </div>
                  </TabsContent>

                  {/* Pricing Tab */}
                  <TabsContent value="pricing" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <IndianRupee className="h-5 w-5 text-green-600" />
                        Pricing Details
                      </h3>
                      <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50/50 to-white">
                        <CardContent className="p-6">
                          <div className="space-y-2">
                            <Label htmlFor="base_price_inr" className="text-sm font-semibold text-stone-700 flex items-center gap-2">
                              <IndianRupee className="h-4 w-4 text-green-600" />
                              Base Price (₹) <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-green-600">₹</div>
                              <Input
                                id="base_price_inr"
                                name="base_price_inr"
                                type="number"
                                defaultValue={service.base_price_inr || 0}
                                required
                                min="0"
                                className="h-14 pl-12 text-xl font-bold border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
                              />
                            </div>
                            <p className="text-xs text-stone-500 flex items-center gap-1 mt-2">
                              <Info className="h-3 w-3" />
                              This is the base price customers will pay for this service
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Content Tab */}
                  <TabsContent value="content" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Content & Descriptions
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-sm font-semibold text-stone-700">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            name="description"
                            defaultValue={service.description || ''}
                            rows={6}
                            placeholder="Detailed description of the service..."
                            className="border-2 border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pooja_explanation" className="text-sm font-semibold text-stone-700">
                            Pooja Explanation
                          </Label>
                          <Textarea
                            id="pooja_explanation"
                            name="pooja_explanation"
                            defaultValue={service.pooja_explanation || ''}
                            rows={5}
                            placeholder="Explain what this pooja does and its significance..."
                            className="border-2 border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl resize-none"
                          />
                          <p className="text-xs text-stone-500">This will be shown to customers to help them understand the pooja</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-purple-600" />
                        Advanced Settings
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-2 border-stone-200 hover:border-orange-300 transition-all hover:shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-xl">
                                  <Zap className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                  <Label htmlFor="is_active_single_pooja" className="text-sm font-semibold text-stone-900 cursor-pointer">
                                    Active Single Pooja
                                  </Label>
                                  <p className="text-xs text-stone-500 mt-1">Make this the primary bookable service</p>
                                </div>
                              </div>
                              <Switch
                                id="is_active_single_pooja"
                                checked={isActiveSinglePooja}
                                onCheckedChange={setIsActiveSinglePooja}
                                className="data-[state=checked]:bg-orange-500"
                              />
                            </div>
                            {isActiveSinglePooja && (
                              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-xs text-green-700">
                                <CheckCircle2 className="h-4 w-4" />
                                This service will be prominently displayed
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-stone-200 hover:border-amber-300 transition-all hover:shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-100 rounded-xl">
                                  <Sparkles className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                  <Label htmlFor="event_category" className="text-sm font-semibold text-stone-900 cursor-pointer">
                                    Event-Based
                                  </Label>
                                  <p className="text-xs text-stone-500 mt-1">Mark as event-based pooja</p>
                                </div>
                              </div>
                              <Switch
                                id="event_category"
                                checked={isEventBased}
                                onCheckedChange={setIsEventBased}
                                className="data-[state=checked]:bg-amber-500"
                              />
                            </div>
                            {isEventBased && (
                              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-700">
                                <CheckCircle2 className="h-4 w-4" />
                                This will appear in event-based listings
                              </div>
                            )}
                          </CardContent>
                        </Card>
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
                  className="h-11 px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all rounded-xl font-semibold"
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
