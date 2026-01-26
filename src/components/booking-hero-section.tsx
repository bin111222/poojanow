import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  CheckCircle2, 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  Users, 
  TrendingUp,
  Sparkles,
  Shield,
  Heart,
  Calendar,
  Moon,
  Building2
} from "lucide-react"
import Link from "next/link"

const eventTypeIcons: Record<string, any> = {
  'festivals': Sparkles,
  'life-events': Heart,
  'remedial': Shield,
  'auspicious-days': Calendar,
  'monthly-rituals': Moon,
  'special-occasions': Sparkles
}

interface BookingHeroSectionProps {
  service: any
  pandit: any
  temple: any
  eventType: any
}

export function BookingHeroSection({ service, pandit, temple, eventType }: BookingHeroSectionProps) {
  const rating = pandit?.rating || 0
  const totalReviews = pandit?.total_reviews || 0
  const yearsExperience = pandit?.years_of_experience || 0
  const totalBookings = pandit?.total_bookings || 0

  const EventIcon = eventType ? (eventTypeIcons[eventType.slug] || Sparkles) : null

  return (
    <div className="mb-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-stone-900 mb-2">
          {service.title}
        </h1>
        {service.description && (
          <p className="text-lg text-stone-600 max-w-3xl">
            {service.description}
          </p>
        )}
      </div>

      {/* Event Type Badge */}
      {eventType && (
        <div className="flex items-center gap-2">
          {EventIcon && <EventIcon className="h-5 w-5 text-primary" />}
          <Badge variant="secondary" className="text-base px-4 py-2 bg-primary/10 text-primary border-primary/20">
            {eventType.name}
          </Badge>
          {eventType.description && (
            <p className="text-stone-600 text-sm">{eventType.description}</p>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pandit Card */}
        {pandit && (
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/30 flex-shrink-0">
                  <AvatarImage src={pandit.profile_image_path || ""} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-heading">
                    {pandit.full_name?.[0] || "P"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-stone-900">
                      {pandit.full_name || "Pandit"}
                    </h3>
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  </div>

                  {/* Rating & Stats */}
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    {rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{rating.toFixed(1)}</span>
                        {totalReviews > 0 && (
                          <span className="text-stone-500 text-sm">({totalReviews})</span>
                        )}
                      </div>
                    )}
                    {yearsExperience > 0 && (
                      <div className="flex items-center gap-1 text-stone-600 text-sm">
                        <Award className="h-4 w-4" />
                        <span>{yearsExperience}+ years</span>
                      </div>
                    )}
                    {totalBookings > 0 && (
                      <div className="flex items-center gap-1 text-stone-600 text-sm">
                        <Users className="h-4 w-4" />
                        <span>{totalBookings} bookings</span>
                      </div>
                    )}
                  </div>

                  {/* Specialties */}
                  {pandit.specialties && pandit.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {pandit.specialties.slice(0, 3).map((spec: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Location */}
                  {(pandit.city || pandit.state) && (
                    <div className="flex items-center gap-1 text-sm text-stone-600">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{pandit.city}{pandit.city && pandit.state && ', '}{pandit.state}</span>
                    </div>
                  )}

                  <Link href={`/pandits/${pandit.id}`} className="mt-3 inline-block">
                    <span className="text-sm text-primary hover:underline">View Full Profile →</span>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Temple Card */}
        {temple && (
          <Card className="border-2 border-stone-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-stone-900 mb-2">
                    {temple.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-stone-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {temple.city}
                      {temple.city && temple.state && ', '}
                      {temple.state}
                    </span>
                  </div>

                  {temple.description && (
                    <p className="text-sm text-stone-600 line-clamp-2">
                      {temple.description}
                    </p>
                  )}

                  <Link href={`/temples/${temple.slug || temple.id}`} className="mt-3 inline-block">
                    <span className="text-sm text-primary hover:underline">View Temple Details →</span>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* What's Included */}
      <Card className="bg-gradient-to-r from-primary/5 to-orange-50 border-primary/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            What's Included in This Pooja
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone-900">Authentic Vedic Rituals</p>
                <p className="text-sm text-stone-600">Traditional mantras and procedures</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone-900">Complete Samagri</p>
                <p className="text-sm text-stone-600">All required materials included</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone-900">Photo & Video Proof</p>
                <p className="text-sm text-stone-600">Documented evidence of completion</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone-900">Digital Certificate</p>
                <p className="text-sm text-stone-600">Official certificate of completion</p>
              </div>
            </div>
            {service.pooja_explanation && (
              <div className="flex items-start gap-2 sm:col-span-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-stone-900">Detailed Explanation</p>
                  <p className="text-sm text-stone-600">{service.pooja_explanation}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="text-center border-stone-200">
          <CardContent className="p-4">
            <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-stone-900">Verified Pandit</p>
            <p className="text-xs text-stone-600">Background checked</p>
          </CardContent>
        </Card>
        <Card className="text-center border-stone-200">
          <CardContent className="p-4">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-stone-900">Scheduled Timing</p>
            <p className="text-xs text-stone-600">At your convenience</p>
          </CardContent>
        </Card>
        <Card className="text-center border-stone-200">
          <CardContent className="p-4">
            <Award className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-stone-900">Quality Assured</p>
            <p className="text-xs text-stone-600">100% satisfaction</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


