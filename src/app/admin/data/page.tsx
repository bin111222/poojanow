import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Sparkles, 
  Users, 
  Building2, 
  Eye
} from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { EditServiceDialog } from "@/components/admin/edit-service-dialog"
import { EditPanditDialog } from "@/components/admin/edit-pandit-dialog"
import { EditTempleDialog } from "@/components/admin/edit-temple-dialog"
import { DataSearchClient } from "./search-client"

export default async function AdminDataPage({
  searchParams
}: {
  searchParams: { tab?: string; search?: string }
}) {
  const supabase = createClient()
  const activeTab = searchParams.tab || "services"
  const searchQuery = searchParams.search || ""

  // Fetch Services
  let servicesQuery = supabase
    .from("services")
    .select(`
      *,
      temples (id, name),
      event_types (id, name, slug),
      profiles!services_pandit_id_fkey (id, full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  if (searchQuery) {
    servicesQuery = servicesQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  }

  const { data: services } = await servicesQuery

  // Fetch Pandits
  let panditsQuery = supabase
    .from("pandit_profiles")
    .select(`
      *,
      profiles (id, full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  if (searchQuery && activeTab === "pandits") {
    panditsQuery = panditsQuery.or(`bio.ilike.%${searchQuery}%`)
  }

  const { data: pandits } = await panditsQuery

  // Fetch Pandit names for search
  if (searchQuery && activeTab === "pandits") {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .ilike("full_name", `%${searchQuery}%`)
    
    if (profiles && profiles.length > 0) {
      const profileIds = profiles.map(p => p.id)
      const { data: additionalPandits } = await supabase
        .from("pandit_profiles")
        .select(`
          *,
          profiles (id, full_name, email)
        `)
        .in("id", profileIds)
      
      // Merge results
      const existingIds = new Set(pandits?.map(p => p.id) || [])
      const newPandits = additionalPandits?.filter(p => !existingIds.has(p.id)) || []
      if (pandits) {
        pandits.push(...newPandits)
      }
    }
  }

  // Fetch Temples
  let templesQuery = supabase
    .from("temples")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (searchQuery && activeTab === "temples") {
    templesQuery = templesQuery.or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,deity.ilike.%${searchQuery}%`)
  }

  const { data: temples } = await templesQuery

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Data Management</h1>
          <p className="text-stone-600 mt-1">Edit and manage all platform data</p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <Tabs defaultValue={activeTab} className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Services/Poojas
            </TabsTrigger>
            <TabsTrigger value="pandits" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Pandits
            </TabsTrigger>
            <TabsTrigger value="temples" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Temples
            </TabsTrigger>
          </TabsList>
          
          <Suspense fallback={<div className="flex-1 max-w-md h-10 bg-stone-100 rounded animate-pulse" />}>
            <DataSearchClient />
          </Suspense>
        </div>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Services & Poojas ({services?.length || 0})</CardTitle>
                <Button asChild>
                  <Link href="/admin/data?tab=services&action=create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Service
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services && services.length > 0 ? (
                  services.map((service: any) => (
                    <ServiceRow key={service.id} service={service} />
                  ))
                ) : (
                  <div className="text-center py-12 text-stone-500">
                    No services found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pandits Tab */}
        <TabsContent value="pandits" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pandits ({pandits?.length || 0})</CardTitle>
                <Button variant="outline" asChild>
                  <Link href="/admin/pandits">
                    Manage Pandits
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pandits && pandits.length > 0 ? (
                  pandits.map((pandit: any) => (
                    <PanditRow key={pandit.id} pandit={pandit} />
                  ))
                ) : (
                  <div className="text-center py-12 text-stone-500">
                    No pandits found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Temples Tab */}
        <TabsContent value="temples" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Temples ({temples?.length || 0})</CardTitle>
                <Button variant="outline" asChild>
                  <Link href="/admin/temples">
                    Manage Temples
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {temples && temples.length > 0 ? (
                  temples.map((temple: any) => (
                    <TempleRow key={temple.id} temple={temple} />
                  ))
                ) : (
                  <div className="text-center py-12 text-stone-500">
                    No temples found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ServiceRow({ service }: { service: any }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:border-primary/30 hover:shadow-md transition-all group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-stone-900 truncate">{service.title}</h3>
          <Badge variant={service.status === 'published' ? 'default' : 'secondary'}>
            {service.status}
          </Badge>
          {service.event_category === 'event_based' && (
            <Badge variant="outline" className="text-xs">
              Event-Based
            </Badge>
          )}
          {service.is_active_single_pooja && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
              Active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-stone-600">
          {service.profiles && (
            <span>Pandit: {service.profiles.full_name || 'N/A'}</span>
          )}
          {service.temples && (
            <span>Temple: {service.temples.name || 'N/A'}</span>
          )}
          {service.event_types && (
            <span>Event: {service.event_types.name}</span>
          )}
          <span>₹{service.base_price_inr || 0}</span>
          {service.duration_minutes && (
            <span>{service.duration_minutes} mins</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <EditServiceDialog service={service} />
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/book/${service.id}`} target="_blank">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function PanditRow({ pandit }: { pandit: any }) {
  const profile = pandit.profiles || {}
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:border-primary/30 hover:shadow-md transition-all group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-stone-900 truncate">
            {profile.full_name || 'Unknown Pandit'}
          </h3>
          <Badge variant={pandit.profile_status === 'published' ? 'default' : 'secondary'}>
            {pandit.profile_status}
          </Badge>
          {pandit.verification_status === 'verified' && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
              Verified
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-stone-600">
          {pandit.city && pandit.state && (
            <span>{pandit.city}, {pandit.state}</span>
          )}
          {pandit.rating && (
            <span>⭐ {pandit.rating.toFixed(1)}</span>
          )}
          {pandit.total_bookings && (
            <span>{pandit.total_bookings} bookings</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <EditPanditDialog pandit={pandit} />
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/pandits/${pandit.id}`} target="_blank">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function TempleRow({ temple }: { temple: any }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:border-primary/30 hover:shadow-md transition-all group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-stone-900 truncate">{temple.name}</h3>
          <Badge variant={temple.status === 'published' ? 'default' : 'secondary'}>
            {temple.status}
          </Badge>
          {temple.verified && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
              Verified
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-stone-600">
          {temple.city && temple.state && (
            <span>{temple.city}, {temple.state}</span>
          )}
          {temple.deity && (
            <span>Deity: {temple.deity}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <EditTempleDialog temple={temple} />
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/temples/${temple.slug}`} target="_blank">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

