import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star } from "lucide-react"

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
    <Card className="overflow-hidden">
      <div className="flex flex-row p-6 gap-4 items-start">
        <div className="h-20 w-20 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
             {pandit.profile_image_path ? (
                 <img src={pandit.profile_image_path} alt={pandit.full_name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                    User
                </div>
            )}
        </div>
        <div className="flex-1">
            <h3 className="font-semibold text-lg">{pandit.full_name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="mr-1 h-3 w-3" />
                {pandit.city}, {pandit.state}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
                {pandit.specialties?.slice(0, 3).map((spec, i) => (
                    <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                        {spec}
                    </span>
                ))}
            </div>
        </div>
      </div>
      <CardFooter>
        <Link href={`/pandits/${pandit.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

