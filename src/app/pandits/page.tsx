import { createClient } from "@/utils/supabase/server"
import { PanditCard } from "@/components/pandit-card"

export default async function PanditsPage() {
  const supabase = createClient()
  
  // Join pandit_profiles with profiles to get the name
  const { data: pandits } = await supabase
    .from("pandit_profiles")
    .select(`
      *,
      profiles:id (
        full_name
      )
    `)
    .eq("profile_status", "published")
    .eq("verification_status", "verified")

  // Transform data to flatten the structure for the card
  const formattedPandits = pandits?.map(p => ({
    ...p,
    full_name: p.profiles?.full_name || "Unknown Pandit"
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Find a Pandit</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formattedPandits?.map((pandit) => (
          <PanditCard key={pandit.id} pandit={pandit} />
        ))}
        {(!formattedPandits || formattedPandits.length === 0) && (
            <p className="col-span-full text-center text-muted-foreground py-12">
                No pandits found. Please check back later.
            </p>
        )}
      </div>
    </div>
  )
}

