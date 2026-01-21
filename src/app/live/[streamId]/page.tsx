import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Share2, Heart } from "lucide-react"

export default async function StreamPlayerPage({ params }: { params: { streamId: string } }) {
  const supabase = createClient()
  
  const { data: stream } = await supabase
    .from("streams")
    .select(`
      *,
      temples (name, city),
      pandit_profiles:pandit_id (
        profiles:id (full_name)
      )
    `)
    .eq("id", params.streamId)
    .single()

  if (!stream) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-6 px-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Player Area */}
          <div className="lg:col-span-2 space-y-4">
             <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative shadow-2xl border border-gray-800">
                {/* Mock Player */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {stream.playback_url ? (
                        <iframe 
                            src={stream.playback_url} 
                            className="w-full h-full" 
                            allowFullScreen 
                            allow="autoplay; encrypted-media"
                        />
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-500 mb-2">Stream Source Unavailable</p>
                            <p className="text-xs text-gray-600">ID: {stream.id}</p>
                        </div>
                    )}
                </div>
             </div>
             
             <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{stream.title}</h1>
                    <p className="text-gray-400 mt-1">
                        {stream.temples?.name || stream.pandit_profiles?.profiles?.full_name}
                        {stream.temples?.city && ` • ${stream.temples.city}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                        <Share2 className="h-4 w-4 mr-2" /> Share
                    </Button>
                    <Button variant="destructive" size="sm">
                        <Heart className="h-4 w-4 mr-2" /> Follow
                    </Button>
                </div>
             </div>
          </div>

          {/* Sidebar (Chat / Offerings) */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 h-[600px] flex flex-col">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-semibold">Live Chat</h3>
                <Badge variant="outline" className="text-red-400 border-red-900 bg-red-900/20">
                    <Eye className="h-3 w-3 mr-1" /> {stream.viewer_count}
                </Badge>
             </div>
             
             <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {/* Mock Chat Messages */}
                <div className="text-sm">
                    <span className="font-bold text-blue-400">Rohan:</span> <span className="text-gray-300">Har Har Mahadev! 🙏</span>
                </div>
                <div className="text-sm">
                    <span className="font-bold text-green-400">Priya:</span> <span className="text-gray-300">Beautiful darshan today.</span>
                </div>
                <div className="text-sm">
                    <span className="font-bold text-purple-400">Amit:</span> <span className="text-gray-300">Jay Shree Ram</span>
                </div>
             </div>

             <div className="p-4 border-t border-gray-800 bg-gray-900">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Send Digital Offering (₹51)
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

