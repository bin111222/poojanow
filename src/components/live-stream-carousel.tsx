import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Eye, PlayCircle } from "lucide-react"

interface Stream {
  id: string
  title: string
  thumbnail_path: string | null
  viewer_count: number
  temples?: {
    name: string
    city: string | null
  } | null
}

export function LiveStreamCarousel({ streams }: { streams: Stream[] }) {
  if (!streams || streams.length === 0) return null

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Live Darshan Now
        </h2>
        <Link href="/live">
            <Button variant="ghost" className="text-primary hover:text-primary/80">View All</Button>
        </Link>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {streams.map((stream) => (
            <CarouselItem key={stream.id} className="md:basis-1/2 lg:basis-1/3">
              <Link href={`/live/${stream.id}`}>
                <div className="group relative aspect-video overflow-hidden rounded-xl bg-stone-900 border border-stone-800">
                    {/* Thumbnail */}
                    {stream.thumbnail_path ? (
                        <img 
                            src={stream.thumbnail_path} 
                            alt={stream.title} 
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <PlayCircle className="h-12 w-12 text-stone-700" />
                        </div>
                    )}
                    
                    {/* Overlays */}
                    <div className="absolute top-3 left-3">
                        <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 text-[10px] uppercase tracking-wider font-bold">
                            Live
                        </Badge>
                    </div>
                    
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {stream.viewer_count.toLocaleString()}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                        <h3 className="text-white font-medium truncate">{stream.title}</h3>
                        <p className="text-stone-300 text-xs truncate">
                            {stream.temples?.name}, {stream.temples?.city}
                        </p>
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                            <PlayCircle className="h-10 w-10 text-white fill-white/20" />
                        </div>
                    </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm" />
        <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm" />
      </Carousel>
    </div>
  )
}

