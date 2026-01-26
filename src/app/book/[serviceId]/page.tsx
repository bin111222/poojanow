import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { BookingPageClient } from "./booking-page-client"

export default async function BookingPage({ 
  params,
  searchParams 
}: { 
  params: { serviceId: string },
  searchParams: { panditId?: string, templeId?: string }
}) {
  const supabase = createClient()
  
  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?next=/book/${params.serviceId}`)
  }

  // Fetch Service Details with all related data
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select(`
      *,
      temples (id, name, city, state, description, hero_image_path),
      event_types (id, name, slug, description, icon)
    `)
    .eq("id", params.serviceId)
    .eq("status", "published")
    .single()

  if (serviceError) {
    console.error('Service fetch error:', serviceError)
    console.error('Service ID:', params.serviceId)
    notFound()
  }

  if (!service) {
    console.error('Service not found. ID:', params.serviceId)
    notFound()
  }

  // Check if service is bookable (active single pooja OR event-based)
  const isBookable = service.is_active_single_pooja === true || service.event_category === 'event_based'
  
  if (!isBookable) {
    console.error('Service is not bookable. is_active_single_pooja:', service.is_active_single_pooja, 'event_category:', service.event_category)
    notFound()
  }

  // Fetch Service Packages with offerings
  const { data: packages } = await supabase
    .from("service_packages")
    .select(`
      *,
      service_package_offerings (
        quantity,
        included,
        offerings (
          id,
          title,
          description
        )
      )
    `)
    .eq("service_id", params.serviceId)
    .eq("active", true)
    .order("sort_order", { ascending: true })

  // Transform packages data for easier use
  const formattedPackages = packages?.map(pkg => ({
    ...pkg,
    offerings: pkg.service_package_offerings?.map((spo: any) => ({
      id: spo.offerings.id,
      title: spo.offerings.title,
      description: spo.offerings.description,
      quantity: spo.quantity,
      included: spo.included
    })) || []
  })) || []

  // Fetch Pandit Details
  let pandit = null
  let panditProfile = null
  if (service.pandit_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", service.pandit_id)
      .single()

    const { data: panditData } = await supabase
      .from("pandit_profiles")
      .select("*")
      .eq("id", service.pandit_id)
      .single()

    if (profile && panditData) {
      pandit = {
        ...panditData,
        full_name: profile.full_name,
        email: profile.email
      }
    }
  }

  // Get temple data (handle array case)
  const temple = service.temples && !Array.isArray(service.temples) 
    ? service.temples 
    : null

  // Get event type data
  const eventType = service.event_types && !Array.isArray(service.event_types)
    ? service.event_types
    : null

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <BookingPageClient 
          service={service} 
          packages={formattedPackages}
          temple={temple}
          pandit={pandit}
          eventType={eventType}
        />
      </div>
    </div>
  )
}

