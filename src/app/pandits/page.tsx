import { createClient } from "@/utils/supabase/server"
import { PanditCard } from "@/components/pandit-card"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function PanditsPage() {
  const supabase = createClient()
  
  // Query pandit_profiles first
  const { data: pandits, error: panditsError } = await supabase
    .from("pandit_profiles")
    .select("*")
    .eq("profile_status", "published")
    .eq("verification_status", "verified")

  if (panditsError) {
    console.error("Error fetching pandits:", panditsError)
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

  const formattedPandits = pandits?.map(p => ({
    ...p,
    full_name: profilesMap.get(p.id)?.full_name || "Unknown Pandit"
  }))

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
                <Button variant="outline" className="h-12 rounded-full px-6 border-stone-200">
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
