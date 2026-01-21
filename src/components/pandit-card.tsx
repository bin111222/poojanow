import Link from "next/link"
import { MapPin, CheckCircle2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PanditProfile {
  id: string
  full_name: string
  city: string | null
  state: string | null
  specialties: string[] | null
  profile_image_path: string | null
}

export function PanditCard({ pandit }: { pandit: PanditProfile }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-stone-100 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20 border-2 border-stone-100 shadow-sm">
            <AvatarImage src={pandit.profile_image_path || ""} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-heading">
                {pandit.full_name[0]}
            </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="font-heading text-lg font-bold text-stone-900 truncate">
                    {pandit.full_name}
                </h3>
                <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
            </div>
            
            <div className="flex items-center text-sm text-stone-500 mb-3">
                <MapPin className="mr-1 h-3 w-3" />
                {pandit.city}, {pandit.state}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {pandit.specialties?.slice(0, 3).map((spec, i) => (
                    <Badge key={i} variant="secondary" className="bg-stone-100 text-stone-600 hover:bg-stone-200 font-normal">
                        {spec}
                    </Badge>
                ))}
                {pandit.specialties && pandit.specialties.length > 3 && (
                    <Badge variant="secondary" className="bg-stone-50 text-stone-500">
                        +{pandit.specialties.length - 3}
                    </Badge>
                )}
            </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-stone-100 flex gap-3">
        <Link href={`/pandits/${pandit.id}`} className="flex-1">
            <Button className="w-full bg-stone-900 hover:bg-primary text-white transition-colors rounded-full">
                Book Now
            </Button>
        </Link>
        <Link href={`/pandits/${pandit.id}`}>
            <Button variant="outline" className="rounded-full border-stone-200 hover:bg-stone-50">
                Profile
            </Button>
        </Link>
      </div>
    </div>
  )
}
