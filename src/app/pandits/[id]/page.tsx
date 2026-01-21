import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { MapPin, CheckCircle2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function PanditDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: pandit } = await supabase
    .from("pandit_profiles")
    .select(`
      *,
      profiles:id (
        full_name,
        email
      ),
      services(*)
    `)
    .eq("id", params.id)
    .eq("profile_status", "published")
    .single()

  if (!pandit) {
    notFound()
  }

  const fullName = pandit.profiles?.full_name || "Pandit"

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-lg">
                    <AvatarImage src={pandit.profile_image_path || ""} />
                    <AvatarFallback className="text-4xl">{fullName[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left space-y-2 flex-1">
                    <h1 className="text-3xl font-bold">{fullName}</h1>
                    <div className="flex items-center justify-center md:justify-start text-muted-foreground gap-2">
                        <MapPin className="h-4 w-4" />
                        {pandit.city}, {pandit.state}
                        {pandit.verification_status === 'verified' && (
                             <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-100">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                             </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                        {pandit.specialties?.map((spec: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                                {spec}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button>Book Now</Button>
                    <Button variant="outline">Message</Button>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto grid gap-8 py-12 px-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>{pandit.bio || "No bio available."}</p>
              <p className="mt-4">
                <strong>Languages:</strong> {pandit.languages?.join(", ")}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Services</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {pandit.services?.filter((s: any) => s.status === 'published').map((service: any) => (
                <ServiceCard key={service.id} service={service} panditId={pandit.id} />
              ))}
              {(!pandit.services || pandit.services.length === 0) && (
                 <p className="text-muted-foreground">No services currently listed.</p>
              )}
            </div>
          </section>
        </div>
        
        <div className="space-y-6">
             {/* Sidebar for reviews or other info later */}
             <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Availability</h3>
                <p className="text-sm text-muted-foreground">Check booking calendar for available slots.</p>
             </div>
        </div>
      </div>
    </div>
  )
}

