import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

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
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-gray-100 relative">
        {/* Placeholder for image - in real app use Next.js Image with Supabase storage URL */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
            {temple.hero_image_path ? (
                 <img src={temple.hero_image_path} alt={temple.name} className="w-full h-full object-cover" />
            ) : (
                <span>No Image</span>
            )}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{temple.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-3 w-3" />
          {temple.city}, {temple.state}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Deity: <span className="font-medium text-foreground">{temple.deity}</span>
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/temples/${temple.slug}`} className="w-full">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

