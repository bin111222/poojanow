import { createClient } from "@/utils/supabase/server"
import { TempleCard } from "@/components/temple-card"

export default async function TemplesPage() {
  const supabase = createClient()
  
  const { data: temples } = await supabase
    .from("temples")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Temples</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {temples?.map((temple) => (
          <TempleCard key={temple.id} temple={temple} />
        ))}
        {(!temples || temples.length === 0) && (
            <p className="col-span-full text-center text-muted-foreground py-12">
                No temples found. Please check back later.
            </p>
        )}
      </div>
    </div>
  )
}

