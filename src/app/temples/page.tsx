import { createClient } from "@/utils/supabase/server"
import { TempleCard } from "@/components/temple-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default async function TemplesPage() {
  const supabase = createClient()
  
  const { data: temples } = await supabase
    .from("temples")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 pt-24 pb-12">
        <div className="container mx-auto px-4">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-stone-900 mb-4">
                Sacred Temples
            </h1>
            <p className="text-stone-600 max-w-2xl text-lg mb-8">
                Discover and book poojas at the most revered spiritual destinations across India.
            </p>
            
            {/* Search Bar (Visual only for V1) */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <Input 
                    placeholder="Search by name, deity, or city..." 
                    className="pl-10 h-12 rounded-full border-stone-200 bg-stone-50 focus:bg-white transition-all"
                />
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {temples?.map((temple) => (
            <TempleCard key={temple.id} temple={temple} />
          ))}
          {(!temples || temples.length === 0) && (
              <div className="col-span-full text-center py-20">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
                    <Search className="h-8 w-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-medium text-stone-900">No temples found</h3>
                  <p className="text-stone-500">Try adjusting your search or check back later.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
