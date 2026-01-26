import { createClient } from "@/utils/supabase/server"
import { PanditCard } from "@/components/pandit-card"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function PanditsPage() {
  const supabase = createClient()
  
  // Query pandit_profiles - start simple without joins
  // Show published pandits (verification is optional for now)
  const { data: pandits, error: panditsError } = await supabase
    .from("pandit_profiles")
    .select("*")
    .eq("profile_status", "published")
    // Don't filter by verification_status - show all published pandits
    // RLS policy allows viewing published pandits regardless of verification status

  if (panditsError) {
    console.error("Error fetching pandits:", panditsError)
    console.error("Error details:", JSON.stringify(panditsError, null, 2))
  }

  // Debug: Log what we found
  console.log("Pandits found:", pandits?.length || 0)
  if (pandits && pandits.length > 0) {
    console.log("Sample pandit:", {
      id: pandits[0].id,
      profile_status: pandits[0].profile_status,
      verification_status: pandits[0].verification_status
    })
  } else {
    console.error("No pandits returned! Check:")
    console.error("1. Are there pandit_profiles with profile_status = 'published'?")
    console.error("2. Are RLS policies allowing public read?")
    console.error("3. Is the query returning null or empty array?")
  }

  // Get all profile IDs and fetch profiles separately
  const profileIds = pandits?.map(p => p.id) || []
  
  let profilesMap = new Map()
  if (profileIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", profileIds)
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
    } else if (profiles) {
      profiles.forEach(p => profilesMap.set(p.id, p))
    }
  }

  // Fetch services separately for each pandit (if needed for Book Now button)
  const panditIds = pandits?.map(p => p.id) || []
  let servicesMap = new Map()
  
  if (panditIds.length > 0) {
    const { data: allServices } = await supabase
      .from("services")
      .select("id, pandit_id, status, is_active_single_pooja")
      .in("pandit_id", panditIds)
      .eq("status", "published")
      .eq("is_active_single_pooja", true)
    
    if (allServices) {
      allServices.forEach((service: any) => {
        if (!servicesMap.has(service.pandit_id)) {
          servicesMap.set(service.pandit_id, [])
        }
        servicesMap.get(service.pandit_id)!.push(service)
      })
    }
  }

  const formattedPandits = pandits?.map(p => ({
    ...p,
    full_name: profilesMap.get(p.id)?.full_name || "Unknown Pandit",
    services: servicesMap.get(p.id) || [] // Get services for this pandit
  })) || []
  
  console.log("Formatted pandits count:", formattedPandits.length)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 pt-24 pb-12">
        <div className="container mx-auto px-4">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-stone-900 mb-4">
                Verified Pandits
            </h1>
            <p className="text-stone-600 max-w-2xl text-lg mb-8">
                Connect with experienced Vedic scholars for your home rituals and ceremonies.
            </p>
            
            <div className="flex gap-4 max-w-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <Input 
                        placeholder="Search by name or location..." 
                        className="pl-10 h-12 rounded-full border-stone-200 bg-stone-50 focus:bg-white transition-all"
                    />
                </div>
                <Button variant="outline" className="h-12 rounded-full px-6 border-stone-200 bg-white text-stone-900 hover:bg-stone-100 hover:text-stone-900 shadow-sm hover:shadow-md transition-all">
                    <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formattedPandits?.map((pandit) => (
            <PanditCard key={pandit.id} pandit={pandit} />
          ))}
          {(!formattedPandits || formattedPandits.length === 0) && (
              <div className="col-span-full text-center py-20">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
                    <Search className="h-8 w-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-medium text-stone-900">No pandits found</h3>
                  <p className="text-stone-500">We are onboarding new pandits every day.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
