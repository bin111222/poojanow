import { createClient } from "@/utils/supabase/server"
import { PoojaGroupCard } from "@/components/pooja-group-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Heart, Shield, Calendar, Moon, Star } from "lucide-react"
import Link from "next/link"

const eventTypeIcons: Record<string, any> = {
  'festivals': Sparkles,
  'life-events': Heart,
  'remedial': Shield,
  'auspicious-days': Calendar,
  'monthly-rituals': Moon,
  'special-occasions': Star
}

export default async function PoojasByEventPage({
  searchParams
}: {
  searchParams: { type?: string }
}) {
  const supabase = createClient()
  const selectedType = searchParams.type

  // Fetch all event types
  const { data: eventTypes } = await supabase
    .from("event_types")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })

  // Get event_type_id if a specific type is selected
  let selectedEventTypeId: string | null = null
  if (selectedType) {
    const selectedEventType = eventTypes?.find(et => et.slug === selectedType)
    selectedEventTypeId = selectedEventType?.id || null
  }

  // Fetch services by event type
  let servicesQuery = supabase
    .from("services")
    .select(`
      *,
      event_types (id, name, slug, icon),
      temples (id, name, city, state)
    `)
    .eq("status", "published")
    .eq("event_category", "event_based")

  if (selectedEventTypeId) {
    servicesQuery = servicesQuery.eq("event_type_id", selectedEventTypeId)
  }

  const { data: services, error: servicesError } = await servicesQuery
    .order("base_price_inr", { ascending: true })

  // Debug logging
  if (servicesError) {
    console.error("Error fetching services:", servicesError)
  }

  // Fetch pandit names for all services
  const panditIds = [...new Set(services?.map((s: any) => s.pandit_id).filter(Boolean) || [])]
  let panditNamesMap = new Map()
  
  if (panditIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", panditIds)
    
    if (profiles) {
      profiles.forEach(p => panditNamesMap.set(p.id, p.full_name))
    }
  }

  // Group services by title (normalized)
  const poojasByTitle = new Map<string, any>()
  
  services?.forEach((service: any) => {
    if (!service.event_types) return
    
    const title = service.title.trim()
    const normalizedTitle = title.toLowerCase()
    
    if (!poojasByTitle.has(normalizedTitle)) {
      poojasByTitle.set(normalizedTitle, {
        title,
        description: service.description,
        duration_minutes: service.duration_minutes,
        event_type: {
          name: service.event_types.name,
          slug: service.event_types.slug
        },
        pandits: []
      })
    }
    
    // Add this pandit's service to the group
    const poojaGroup = poojasByTitle.get(normalizedTitle)
    poojaGroup.pandits.push({
      service_id: service.id,
      pandit_id: service.pandit_id,
      pandit_name: panditNamesMap.get(service.pandit_id) || "Pandit",
      price: service.base_price_inr || 0,
      temple_name: service.temples?.name || null,
      temple_city: service.temples?.city || null,
      temple_state: service.temples?.state || null,
      duration_minutes: service.duration_minutes || null
    })
  })

  // Group poojas by event type
  const poojasByType = new Map()
  eventTypes?.forEach(type => {
    poojasByType.set(type.slug, {
      type,
      poojas: []
    })
  })

  // Add poojas to their event types
  poojasByTitle.forEach((pooja) => {
    const typeSlug = pooja.event_type.slug
    if (poojasByType.has(typeSlug)) {
      poojasByType.get(typeSlug).poojas.push(pooja)
    }
  })

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            Pooja by Event
          </h1>
          <p className="text-stone-600 max-w-2xl text-lg mb-8">
            Discover poojas organized by festivals, life events, and special occasions. Choose a pooja and select from available pandits.
          </p>

          {/* Event Type Filters */}
          <div className="flex flex-wrap gap-3">
            <Link href="/poojas">
              <Badge 
                variant={!selectedType ? "default" : "outline"}
                className={`px-4 py-2 text-sm cursor-pointer transition-all ${
                  !selectedType 
                    ? "bg-primary text-white" 
                    : "bg-white text-stone-700 hover:bg-stone-100"
                }`}
              >
                All Events
              </Badge>
            </Link>
            {eventTypes?.map((type) => {
              const Icon = eventTypeIcons[type.slug] || Star
              return (
                <Link key={type.id} href={`/poojas?type=${type.slug}`}>
                  <Badge
                    variant={selectedType === type.slug ? "default" : "outline"}
                    className={`px-4 py-2 text-sm cursor-pointer transition-all flex items-center gap-2 ${
                      selectedType === type.slug
                        ? "bg-primary text-white"
                        : "bg-white text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {type.name}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-12 px-4">
        {selectedType ? (
          // Show poojas for selected type
          (() => {
            const typeData = poojasByType.get(selectedType)
            if (!typeData || typeData.poojas.length === 0) {
              return (
                <div className="text-center py-20">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
                    <Star className="h-8 w-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-medium text-stone-900">No poojas found</h3>
                  <p className="text-stone-500">No poojas available for this event type yet.</p>
                </div>
              )
            }

            const Icon = eventTypeIcons[selectedType] || Star
            return (
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-stone-900">{typeData.type.name}</h2>
                  <Badge variant="secondary">{typeData.poojas.length} Unique Poojas</Badge>
                </div>
                {typeData.type.description && (
                  <p className="text-stone-600 max-w-3xl">{typeData.type.description}</p>
                )}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {typeData.poojas.map((pooja: any, index: number) => (
                    <PoojaGroupCard key={`${pooja.title}-${index}`} pooja={pooja} />
                  ))}
                </div>
              </div>
            )
          })()
        ) : (
          // Show all event types with their poojas
          <div className="space-y-12">
            {services && services.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
                  <Star className="h-8 w-8 text-stone-400" />
                </div>
                <h3 className="text-lg font-medium text-stone-900 mb-2">No event-based poojas found</h3>
                <p className="text-stone-500 mb-4">
                  Event-based poojas haven't been set up yet. Run the seed script to populate them.
                </p>
                <p className="text-sm text-stone-400">
                  Run: <code className="bg-stone-100 px-2 py-1 rounded">supabase/seed_event_based_poojas.sql</code>
                </p>
              </div>
            ) : (
              Array.from(poojasByType.values()).map(({ type, poojas }) => {
                if (poojas.length === 0) return null
              
                const Icon = eventTypeIcons[type.slug] || Star
                return (
                  <Card key={type.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-primary" />
                          <CardTitle className="text-2xl">{type.name}</CardTitle>
                          <Badge variant="secondary">{poojas.length} Unique Poojas</Badge>
                        </div>
                        <Link href={`/poojas?type=${type.slug}`}>
                          <Badge variant="outline" className="cursor-pointer hover:bg-stone-100">
                            View All →
                          </Badge>
                        </Link>
                      </div>
                      {type.description && (
                        <p className="text-stone-600 mt-2">{type.description}</p>
                      )}
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {poojas.slice(0, 6).map((pooja: any, index: number) => (
                          <PoojaGroupCard key={`${pooja.title}-${index}`} pooja={pooja} />
                        ))}
                      </div>
                      {poojas.length > 6 && (
                        <div className="mt-6 text-center">
                          <Link href={`/poojas?type=${type.slug}`}>
                            <Badge variant="outline" className="cursor-pointer hover:bg-stone-100 px-4 py-2">
                              View {poojas.length - 6} more poojas →
                            </Badge>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
