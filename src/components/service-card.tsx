import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, IndianRupee } from "lucide-react"

interface Service {
  id: string
  title: string
  description: string | null
  duration_minutes: number | null
  base_price_inr: number | null
  service_type: string
}

export function ServiceCard({ service, panditId, templeId }: { service: Service, panditId?: string, templeId?: string }) {
  const bookingUrl = `/book/${service.id}?${panditId ? `panditId=${panditId}` : ''}${templeId ? `&templeId=${templeId}` : ''}`

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{service.title}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {service.duration_minutes && (
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {service.duration_minutes} mins
            </div>
          )}
          {service.base_price_inr && (
            <div className="flex items-center">
              <IndianRupee className="mr-1 h-3 w-3" />
              {service.base_price_inr}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={bookingUrl} className="w-full">
          <Button className="w-full">Book Now</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

