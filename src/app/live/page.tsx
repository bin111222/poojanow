import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, PlayCircle } from "lucide-react"

export default async function LivePage() {
  const supabase = createClient()
  
  const { data: streams } = await supabase
    .from("streams")
    .select(`
      *,
      temples (name),
      pandit_profiles:pandit_id (
        profiles:id (full_name)
      )
    `)
    .eq("status", "live")
    .order("viewer_count", { ascending: false })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Live Darshans</h1>
        <Badge variant="destructive" className="animate-pulse px-3 py-1">
            LIVE NOW
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams?.map((stream) => (
          <Link key={stream.id} href={`/live/${stream.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
              <div className="aspect-video bg-black relative">
                 {/* Thumbnail */}
                 {stream.thumbnail_path ? (
                    <img src={stream.thumbnail_path} alt={stream.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                        <PlayCircle className="h-12 w-12" />
                    </div>
                 )}
                 
                 <div className="absolute top-2 left-2">
                    <Badge variant="destructive" className="text-xs">LIVE</Badge>
                 </div>
                 
                 <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-xs flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {stream.viewer_count} watching
                 </div>
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg line-clamp-1">{stream.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                    {stream.temples?.name || stream.pandit_profiles?.profiles?.full_name}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
        
        {(!streams || streams.length === 0) && (
            <div className="col-span-full text-center py-20 bg-muted/30 rounded-lg">
                <PlayCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No live streams right now</h3>
                <p className="text-muted-foreground">Check back later for scheduled aartis and darshans.</p>
            </div>
        )}
      </div>
    </div>
  )
}

