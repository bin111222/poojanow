import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { MapPin, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import Image from "next/image"

export default async function TempleDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  
  const { data: temple } = await supabase
    .from("temples")
    .select("*, services(*)")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single()

  if (!temple) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full bg-gray-200">
        {temple.hero_image_path ? (
           <img 
            src={temple.hero_image_path} 
            alt={temple.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            No Image Available
          </div>
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 p-6 text-white md:p-12">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold md:text-5xl">{temple.name}</h1>
            <div className="mt-2 flex items-center text-lg opacity-90">
              <MapPin className="mr-2 h-5 w-5" />
              {temple.city}, {temple.state}
              {temple.verified && (
                <span className="ml-4 flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-100 backdrop-blur-sm">
                  <CheckCircle2 className="mr-1 h-4 w-4" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid gap-8 py-12 px-4 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">About the Temple</h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>{temple.description}</p>
              <p className="mt-4">
                <strong>Deity:</strong> {temple.deity}
              </p>
              <p>
                <strong>Address:</strong> {temple.address}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Services & Poojas</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {temple.services?.filter((s: any) => s.status === 'published').map((service: any) => (
                <ServiceCard key={service.id} service={service} templeId={temple.id} />
              ))}
              {(!temple.services || temple.services.length === 0) && (
                 <p className="text-muted-foreground">No services currently listed for this temple.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="rounded-lg border bg-card p-6 shadow-sm">
             <h3 className="font-semibold mb-4">Quick Actions</h3>
             <Button className="w-full mb-2">Donate</Button>
             <Button variant="outline" className="w-full">Contact Temple</Button>
           </div>
        </div>
      </div>
    </div>
  )
}

