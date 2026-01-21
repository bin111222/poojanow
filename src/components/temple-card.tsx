import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Temple {
  id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  deity: string | null
  hero_image_path: string | null
}

export function TempleCard({ temple }: { temple: Temple }) {
  return (
    <Link href={`/temples/${temple.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-stone-100">
        {/* Image Container */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-stone-200 relative">
            {temple.hero_image_path ? (
                 <img 
                    src={temple.hero_image_path} 
                    alt={temple.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                 />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-400 bg-stone-100">
                    <span className="text-sm font-medium">No Image</span>
                </div>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            
            {/* Location Badge */}
            <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 backdrop-blur text-stone-800 hover:bg-white">
                    <MapPin className="mr-1 h-3 w-3 text-primary" />
                    {temple.city}
                </Badge>
            </div>
        </div>

        {/* Content */}
        <div className="p-5">
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">
                {temple.deity}
            </div>
            <h3 className="font-heading text-xl font-bold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                {temple.name}
            </h3>
            <div className="flex items-center text-sm text-stone-500 font-medium mt-4 group-hover:text-primary transition-colors">
                View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </div>
      </div>
    </Link>
  )
}
