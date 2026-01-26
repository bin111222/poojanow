import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { MapPin, CheckCircle2, Star, Clock, Users, Award, BookOpen, Phone, Mail, MessageCircle, Calendar, TrendingUp, Languages, GraduationCap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default async function PanditDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const supabase = createClient()
  
  // Handle Next.js 15 async params or Next.js 14 sync params
  const resolvedParams = await Promise.resolve(params)
  const panditId = resolvedParams.id
  
  console.log("Fetching pandit with ID:", panditId)
  
  // Fetch pandit profile - start with simple query
  const { data: panditData, error: panditError } = await supabase
    .from("pandit_profiles")
    .select("*")
    .eq("id", panditId)
    .eq("profile_status", "published")
    .single()

  if (panditError) {
    console.error("Error fetching pandit:", panditError)
    console.error("Pandit ID:", panditId)
    console.error("Error details:", JSON.stringify(panditError, null, 2))
    notFound()
  }

  if (!panditData) {
    console.error("Pandit not found. ID:", panditId)
    console.error("Query returned null - checking if pandit exists with different status...")
    notFound()
  }

  console.log("Pandit found:", panditData.id, panditData.profile_status)

  // Fetch profile separately (like listing page does)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", panditId)
    .single()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
    // Don't fail - we can still show the page with just pandit data
  }

  // Fetch services separately
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("pandit_id", panditId)
    .eq("status", "published")

  // Fetch temple if temple_id exists
  let temple = null
  if (panditData.temple_id) {
    const { data: templeData } = await supabase
      .from("temples")
      .select("id, name, city, state")
      .eq("id", panditData.temple_id)
      .single()
    temple = templeData
  }

  // Combine data - add relations to pandit object
  const pandit = {
    ...panditData,
    services: services || [],
    temples: temple
  }

  const fullName = profile?.full_name || "Pandit"
  const rating = pandit.rating || 0
  const totalReviews = pandit.total_reviews || 0
  const yearsExperience = pandit.years_of_experience || 0
  const totalBookings = pandit.total_bookings || 0

  // Get active services
  const activeServices = pandit.services?.filter((s: any) => 
    s.status === 'published' && s.is_active_single_pooja === true
  ) || []

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="relative">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-2xl">
                    <AvatarImage src={pandit.profile_image_path || ""} />
                <AvatarFallback className="text-4xl bg-primary/20 text-white">
                  {fullName[0]}
                </AvatarFallback>
                </Avatar>
                        {pandit.verification_status === 'verified' && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-stone-900">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{fullName}</h1>
                  {pandit.featured && (
                    <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
                      <Sparkles className="h-3 w-3 mr-1" /> Featured
                    </Badge>
                        )}
                    </div>
                
                <div className="flex flex-wrap items-center gap-4 text-stone-300 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{pandit.city}, {pandit.state}</span>
                  </div>
                  {pandit.temples && (
                    <div className="flex items-center gap-1">
                      <span className="text-stone-400">•</span>
                      <span>Associated with {pandit.temples.name}</span>
                    </div>
                  )}
                </div>

                {/* Rating and Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-4">
                  {rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xl font-bold ml-1">{rating.toFixed(1)}</span>
                      </div>
                      <span className="text-stone-400">({totalReviews} reviews)</span>
                    </div>
                  )}
                  {yearsExperience > 0 && (
                    <div className="flex items-center gap-2 text-stone-300">
                      <TrendingUp className="h-4 w-4" />
                      <span>{yearsExperience}+ years experience</span>
                    </div>
                  )}
                  {totalBookings > 0 && (
                    <div className="flex items-center gap-2 text-stone-300">
                      <Users className="h-4 w-4" />
                      <span>{totalBookings} bookings</span>
                    </div>
                  )}
                </div>

                {/* Specialties */}
                {pandit.specialties && pandit.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {pandit.specialties.map((spec: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {activeServices.length > 0 && (
                  <Link href={`/book/${activeServices[0].id}?panditId=${pandit.id}`}>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                      <Calendar className="mr-2 h-4 w-4" /> Book Pooja
                    </Button>
                  </Link>
                )}
                <a href="#contact" className="inline-block">
                  <Button size="lg" variant="outline" className="border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/60 rounded-full px-8 shadow-lg hover:shadow-xl transition-all font-medium">
                    <MessageCircle className="mr-2 h-4 w-4" /> Contact
                  </Button>
                </a>
              </div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Services - Prominent at top */}
            {activeServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Available Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {activeServices.map((service: any) => (
                      <ServiceCard key={service.id} service={service} panditId={pandit.id} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* About Section */}
            {(pandit.bio || pandit.experience_description || pandit.lineage) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="h-5 w-5" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pandit.bio && (
                    <div className="prose max-w-none">
                      <p className="text-muted-foreground leading-relaxed text-base">{pandit.bio}</p>
                    </div>
                  )}
                  {pandit.experience_description && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2 text-stone-900">Experience</h4>
                      <p className="text-muted-foreground leading-relaxed">{pandit.experience_description}</p>
                    </div>
                  )}
                  {pandit.lineage && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2 text-stone-900">Spiritual Lineage</h4>
                      <p className="text-muted-foreground">{pandit.lineage}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Qualifications & Education - Compact Grid */}
            {(pandit.qualifications?.length > 0 || pandit.certifications?.length > 0 || pandit.education) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <GraduationCap className="h-5 w-5" />
                    Qualifications & Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pandit.education && (
                    <div>
                      <h4 className="font-semibold mb-2 text-stone-900">Education</h4>
                      <p className="text-muted-foreground">{pandit.education}</p>
                    </div>
                  )}
                  {pandit.qualifications && pandit.qualifications.length > 0 && (
                    <div className={pandit.education ? "pt-4 border-t" : ""}>
                      <h4 className="font-semibold mb-3 text-stone-900">Qualifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {pandit.qualifications.map((qual: string, i: number) => (
                          <Badge key={i} variant="outline" className="bg-stone-50">
                            <Award className="h-3 w-3 mr-1" />
                            {qual}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {pandit.certifications && pandit.certifications.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2 text-stone-900">Certifications</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {pandit.certifications.map((cert: string, i: number) => (
                          <li key={i}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Specializations & Languages - Side by Side */}
            <div className="grid md:grid-cols-2 gap-6">
              {(pandit.specialties?.length > 0 || pandit.pooja_types?.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="h-5 w-5" />
                      Specializations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pandit.pooja_types && pandit.pooja_types.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-stone-900 text-sm">Pooja Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {pandit.pooja_types.map((type: string, i: number) => (
                            <Badge key={i} variant="secondary">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {pandit.specialties && pandit.specialties.length > 0 && (
                      <div className={pandit.pooja_types?.length > 0 ? "pt-3 border-t" : ""}>
                        <h4 className="font-semibold mb-3 text-stone-900 text-sm">Areas of Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {pandit.specialties.map((spec: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Languages & Service Areas Combined */}
              {(pandit.languages?.length > 0 || pandit.service_areas?.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Languages className="h-5 w-5" />
                      Languages & Service Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pandit.languages && pandit.languages.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-stone-900 text-sm">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {pandit.languages.map((lang: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {pandit.service_areas && pandit.service_areas.length > 0 && (
                      <div className={pandit.languages?.length > 0 ? "pt-3 border-t" : ""}>
                        <h4 className="font-semibold mb-3 text-stone-900 text-sm flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Service Areas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {pandit.service_areas.map((area: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Achievements */}
            {pandit.achievements && pandit.achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Award className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {pandit.achievements.map((achievement: string, i: number) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="h-5 w-5" />
                  Reviews & Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent>
                {totalReviews > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center py-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                        <span className="text-3xl font-bold">{rating.toFixed(1)}</span>
                      </div>
                      <p className="text-muted-foreground">Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
                    </div>
                    <Separator />
                    <p className="text-center text-muted-foreground py-6">
                      Reviews feature coming soon. Check back later for customer testimonials.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No reviews yet. Be the first to book and review!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-stone-900">How do I book a pooja with this pandit?</h4>
                    <p className="text-muted-foreground">
                      Click the "Book Pooja" button above and select your preferred date and time. Complete the payment to confirm your booking.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 text-stone-900">What is the response time?</h4>
                    <p className="text-muted-foreground">
                      {pandit.response_time || "The pandit typically responds within 24 hours of booking confirmation."}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 text-stone-900">Can I get proof of the pooja?</h4>
                    <p className="text-muted-foreground">
                      Yes! After the pooja is completed, you will receive photos/videos as proof and a digital certificate.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 text-stone-900">What languages does the pandit speak?</h4>
                    <p className="text-muted-foreground">
                      {pandit.languages && pandit.languages.length > 0 
                        ? `The pandit speaks: ${pandit.languages.join(", ")}`
                        : "Please contact the pandit directly for language preferences."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
        
          {/* Sidebar */}
        <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {yearsExperience > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-semibold">{yearsExperience} years</span>
                  </div>
                )}
                {totalBookings > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Bookings</span>
                    <span className="font-semibold">{totalBookings}</span>
                  </div>
                )}
                {totalReviews > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reviews</span>
                    <span className="font-semibold">{totalReviews}</span>
                  </div>
                )}
                {rating > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{rating.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card id="contact">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pandit.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${pandit.phone}`} className="text-sm hover:underline">
                      {pandit.phone}
                    </a>
                  </div>
                )}
                {pandit.whatsapp && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <a href={`https://wa.me/${pandit.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                      WhatsApp
                    </a>
                  </div>
                )}
                {(pandit.email || profile?.email) && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${pandit.email || profile?.email}`} className="text-sm hover:underline">
                      {pandit.email || profile?.email}
                    </a>
                  </div>
                )}
                {pandit.response_time && (
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Response: {pandit.response_time}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Check the booking calendar for available time slots. Book in advance to secure your preferred date and time.
                </p>
                {activeServices.length > 0 && (
                  <Link href={`/book/${activeServices[0].id}?panditId=${pandit.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full shadow-md hover:shadow-lg transition-all" size="sm">
                      <Calendar className="mr-2 h-4 w-4" /> View Calendar
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Associated Temple */}
            {pandit.temples && (
              <Card>
                <CardHeader>
                  <CardTitle>Associated Temple</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/temples/${pandit.temples.id}`} className="hover:underline">
                    <p className="font-semibold">{pandit.temples.name}</p>
                    <p className="text-sm text-muted-foreground">{pandit.temples.city}, {pandit.temples.state}</p>
                  </Link>
                </CardContent>
              </Card>
            )}
             </div>
        </div>
      </div>
    </div>
  )
}
