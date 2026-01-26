import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { TempleCard } from "@/components/temple-card";
import { LiveStreamCarousel } from "@/components/live-stream-carousel";
import { TestimonialsSection } from "@/components/testimonials-section";
import { PanditCard } from "@/components/pandit-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedSection } from "@/components/animated-section";
import { 
  ArrowRight, 
  Shield, 
  Video, 
  Sparkles, 
  Users, 
  Calendar,
  CheckCircle2,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  PlayCircle,
  Zap,
  Heart,
  Globe,
  Search,
  CreditCard,
  Receipt,
  Phone,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  Award,
  Timer,
  Bell,
  Gift
} from "lucide-react";

export default async function Home() {
  const supabase = createClient();
  
  // Parallel Data Fetching
  const [templesRes, streamsRes, panditsRes, eventTypesRes] = await Promise.all([
    supabase.from("temples").select("*").eq("status", "published").limit(6),
    supabase.from("streams").select("*, temples(name, city)").eq("status", "live").order("viewer_count", { ascending: false }).limit(6),
    supabase.from("pandit_profiles").select("id, city, state, specialties, rating, total_reviews, years_of_experience, total_bookings, profile_image_path").eq("profile_status", "published").order("rating", { ascending: false, nullsFirst: false }).limit(6),
    supabase.from("event_types").select("*").eq("active", true).order("sort_order", { ascending: true }).limit(6)
  ]);

  const featuredTemples = templesRes.data;
  const liveStreams = streamsRes.data;
  const featuredPandits = panditsRes.data;
  const eventTypes = eventTypesRes.data;

  // Fetch pandit names
  let panditNamesMap = new Map()
  if (featuredPandits && featuredPandits.length > 0) {
    const panditIds = featuredPandits.map(p => p.id)
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", panditIds)
    
    if (profiles) {
      profiles.forEach(p => panditNamesMap.set(p.id, p.full_name))
    }
  }

  const faqs = [
    {
      question: "How do I book a pooja?",
      answer: "Simply browse our verified temples, select a service, choose your preferred date and time, and complete the booking. You'll receive confirmation and can watch live if available."
    },
    {
      question: "Can I watch the pooja live?",
      answer: "Yes! Most of our services offer live streaming in HD quality. You'll receive a link to watch your pooja being performed in real-time from anywhere in the world."
    },
    {
      question: "Are the pandits verified?",
      answer: "Absolutely. Every pandit on our platform undergoes a thorough verification process. We check their credentials, experience, and authenticity before allowing them to offer services."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All transactions are 100% secure and encrypted."
    },
    {
      question: "Can I reschedule my booking?",
      answer: "Yes, you can reschedule your booking up to 24 hours before the scheduled time. Simply go to your bookings page and select a new date and time."
    },
    {
      question: "Will I receive prasad?",
      answer: "Yes! We offer prasad delivery for most services. You can choose to have it delivered to your address or pick it up from the temple. Delivery charges may apply."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- ULTRA ENHANCED HERO SECTION --- */}
      <section className="relative pt-8 pb-12 lg:pt-16 lg:pb-20 overflow-hidden">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl animate-pulse delay-500" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-200/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-orange-300/10 rounded-full blur-2xl animate-pulse delay-1500" />
        </div>

        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-stone-50" />
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-300/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-8 z-10">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-100 via-amber-100 to-orange-100 border-2 border-orange-200/50 text-orange-800 text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Sparkles className="h-4 w-4 animate-spin-slow" />
                <span>India's #1 Spiritual Platform</span>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-ping" />
              </div>
              
              {/* Main Heading with Enhanced Effects */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-stone-900 leading-[1.05] animate-in fade-in slide-in-from-bottom-5 duration-300">
                Connect with the{" "}
                <span className="relative inline-block">
                  <span className="text-primary italic bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
                    Divine
                  </span>
                  <svg className="absolute -bottom-3 left-0 w-full h-4 text-orange-200/60" viewBox="0 0 200 20">
                    <path d="M0,10 Q50,0 100,10 T200,10" stroke="currentColor" fill="none" strokeWidth="2" />
                  </svg>
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
                  from anywhere.
                </span>
              </h1>
              
              {/* Enhanced Description */}
              <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-500">
                Book authentic poojas at verified temples, watch live aartis in HD, and consult with experienced pandits. 
                <span className="font-semibold text-stone-700"> 100% Secure & Verified.</span>
              </p>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <Link href="/poojas">
                  <Button size="lg" className="group relative h-16 px-10 rounded-full text-base bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-700 hover:via-amber-700 hover:to-orange-700 text-white shadow-2xl shadow-orange-300/50 hover:shadow-3xl hover:shadow-orange-400/50 transition-all hover:scale-105 hover:-translate-y-1 overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Book a Pooja
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/pandits">
                  <Button variant="outline" size="lg" className="group h-16 px-10 rounded-full text-base border-2 border-stone-300 hover:border-primary hover:bg-white hover:text-primary transition-all hover:scale-105 backdrop-blur-sm bg-white/70 shadow-lg">
                    <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Find a Pandit
                  </Button>
                </Link>
                <Link href="/temples">
                  <Button variant="outline" size="lg" className="group h-16 px-10 rounded-full text-base border-2 border-stone-300 hover:border-primary hover:bg-white hover:text-primary transition-all hover:scale-105 backdrop-blur-sm bg-white/70 shadow-lg">
                    <MapPin className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Explore Temples
                  </Button>
                </Link>
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-stone-600 animate-in fade-in slide-in-from-bottom-10 duration-500">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/70 shadow-md hover:shadow-lg transition-all hover:scale-105">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold">10k+ Happy Devotees</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/70 shadow-md hover:shadow-lg transition-all hover:scale-105">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold">Verified Services</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/70 shadow-md hover:shadow-lg transition-all hover:scale-105">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Right Image/Visual - Enhanced */}
            <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
              <div className="relative animate-slide-in-right">
                {/* Main Image Container with Enhanced Effects */}
                <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/90 rotate-2 hover:rotate-0 transition-all duration-300 ease-out group hover-lift">
                  <img 
                    src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=1200" 
                    alt="Temple Aarti Ceremony" 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/50 via-stone-900/20 to-transparent" />
                  
                  {/* Enhanced Floating Live Badge */}
                  <div className="absolute top-6 right-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-md border-2 border-white/60 shadow-2xl flex items-center gap-2 animate-bounce-in hover:animate-none hover:scale-110 transition-transform animate-glow-pulse">
                    <div className="h-2.5 w-2.5 bg-white rounded-full animate-ping" />
                    <span className="text-white text-xs font-bold tracking-wider">LIVE NOW</span>
                  </div>
                  
                  {/* Enhanced Glass Card Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-white/60 shadow-2xl hover:shadow-3xl transition-all hover-lift animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white text-3xl shadow-xl hover:scale-110 transition-transform">
                        🕉️
                      </div>
                      <div className="flex-1">
                        <p className="font-heading font-bold text-xl text-stone-900">Evening Aarti</p>
                        <p className="text-sm text-stone-600 flex items-center gap-1.5 mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          Kashi Vishwanath • Live Now
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Users className="h-4 w-4 text-stone-400" />
                          <span className="text-xs text-stone-500 font-medium">1.2k watching</span>
                          <div className="h-1 w-1 bg-stone-300 rounded-full" />
                          <span className="text-xs text-stone-500 font-medium">HD Quality</span>
                        </div>
                      </div>
                      <Link href="/live" className="ml-auto">
                        <Button size="sm" className="rounded-full bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-110">
                          <PlayCircle className="mr-1.5 h-4 w-4" />
                          Watch Live
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Enhanced Floating Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-orange-200/40 to-amber-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-yellow-200/15 rounded-full blur-3xl animate-pulse delay-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ENHANCED STATS SECTION --- */}
      <section className="py-20 bg-gradient-to-b from-stone-50 via-white to-stone-50 border-y border-stone-200 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <AnimatedSection className="container px-4 mx-auto relative z-10" stagger={true} staggerDelay={75}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: "10k+", label: "Happy Devotees", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Video, value: "500+", label: "Live Streams", color: "text-red-600", bg: "bg-red-50" },
              { icon: MapPin, value: "80+", label: "Verified Temples", color: "text-green-600", bg: "bg-green-50" },
              { icon: Star, value: "4.9/5", label: "Average Rating", color: "text-amber-600", bg: "bg-amber-50" },
            ].map((stat, i) => (
              <div 
                key={i}
                className="group text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm border-2 border-stone-200/50 hover:border-primary/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden hover-lift"
              >
                {/* Hover Effect */}
                <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br from-white to-stone-50 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg ${stat.color}`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="relative text-4xl font-bold text-stone-900 mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                <div className="relative text-sm text-stone-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* --- MASSIVE HOW IT WORKS SECTION --- */}
      <section className="py-32 bg-gradient-to-b from-white via-stone-50/50 to-white relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="container px-4 mx-auto relative z-10">
          {/* Enhanced Header */}
          <AnimatedSection className="text-center max-w-4xl mx-auto mb-24">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-200/50 text-orange-700 text-sm font-bold mb-8 shadow-lg">
              <Zap className="h-5 w-5 animate-pulse" />
              Simple & Secure Process
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl md:text-2xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Experience authentic spiritual services in just <span className="font-bold text-primary">4 simple steps</span>. 
              From selection to completion, we've made it effortless.
            </p>
          </AnimatedSection>

          <AnimatedSection className="relative" stagger={true} staggerDelay={125}>
            {/* Enhanced Connection Line with Arrows (Desktop) */}
            <div className="hidden lg:block absolute top-32 left-[12%] right-[12%] h-1">
              <div className="relative h-full bg-gradient-to-r from-orange-200 via-amber-200 via-orange-300 to-amber-200 rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                {/* Arrow indicators */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-amber-400 border-t-4 border-t-transparent border-b-4 border-b-transparent"
                    style={{ left: `${25 + i * 33.33}%` }}
                  />
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {[
                {
                  step: "01",
                  icon: Search,
                  title: "Browse & Select",
                  description: "Explore our curated collection of verified temples and experienced pandits. Filter by location, deity, event type, or service category.",
                  features: [
                    "100+ Verified Temples",
                    "200+ Expert Pandits",
                    "Filter by Location & Deity",
                    "Event-Based Categories"
                  ],
                  color: "orange",
                  bgBlur: "bg-orange-200/50",
                  bgGradientFrom: "from-orange-500",
                  bgGradientTo: "to-orange-600",
                  iconBg: "from-orange-100",
                  iconColor: "text-orange-600",
                  cardBg: "bg-gradient-to-br from-orange-50/50 to-white",
                  backgroundImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=600"
                },
                {
                  step: "02",
                  icon: Calendar,
                  title: "Choose Date & Time",
                  description: "Select your preferred date and time slot. Our smart system shows real-time availability and confirms instantly.",
                  features: [
                    "Real-Time Availability",
                    "Instant Confirmation",
                    "Flexible Scheduling",
                    "Timezone Support"
                  ],
                  color: "blue",
                  bgBlur: "bg-blue-200/50",
                  bgGradientFrom: "from-blue-500",
                  bgGradientTo: "to-blue-600",
                  iconBg: "from-blue-100",
                  iconColor: "text-blue-600",
                  cardBg: "bg-gradient-to-br from-blue-50/50 to-white",
                  backgroundImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=600"
                },
                {
                  step: "03",
                  icon: CreditCard,
                  title: "Secure Payment",
                  description: "Complete payment through our encrypted gateway. We support UPI, cards, net banking, and digital wallets.",
                  features: [
                    "Razorpay Integration",
                    "100% Encrypted",
                    "Multiple Payment Options",
                    "Instant Receipt"
                  ],
                  color: "green",
                  bgBlur: "bg-green-200/50",
                  bgGradientFrom: "from-green-500",
                  bgGradientTo: "to-green-600",
                  iconBg: "from-green-100",
                  iconColor: "text-green-600",
                  cardBg: "bg-gradient-to-br from-green-50/50 to-white",
                  backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600"
                },
                {
                  step: "04",
                  icon: Video,
                  title: "Watch Live & Receive",
                  description: "Watch your pooja performed live in HD quality. Receive photo proof, video recording, and digital certificate.",
                  features: [
                    "HD Live Streaming",
                    "Photo & Video Proof",
                    "Digital Certificate",
                    "Prasad Delivery Available"
                  ],
                  color: "amber",
                  bgBlur: "bg-amber-200/50",
                  bgGradientFrom: "from-amber-500",
                  bgGradientTo: "to-amber-600",
                  iconBg: "from-amber-100",
                  iconColor: "text-amber-600",
                  cardBg: "bg-gradient-to-br from-amber-50/50 to-white",
                  backgroundImage: "https://images.unsplash.com/photo-1603386329225-868b9f1c50ea?auto=format&fit=crop&q=80&w=600"
                },
              ].map((step, i) => (
                <Card 
                  key={i}
                  className={`relative group border-2 border-stone-200/50 hover:border-primary/40 ${step.cardBg} shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift overflow-hidden`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <img 
                      src={step.backgroundImage} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Decorative Corner */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.bgGradientFrom}/10 ${step.bgGradientTo}/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <CardContent className="p-8 relative z-10">
                    {/* Step Number Circle - Larger */}
                    <div className="relative mx-auto mb-8">
                      <div className={`absolute inset-0 ${step.bgBlur} rounded-full blur-2xl group-hover:blur-3xl transition-all group-hover:scale-150 opacity-50`} />
                      <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${step.bgGradientFrom} ${step.bgGradientTo} flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-glow-pulse`}>
                        {step.step}
                      </div>
                    </div>
                    
                    {/* Icon - Larger */}
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${step.iconBg} to-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 border-2 border-stone-100`}>
                      <step.icon className={`h-10 w-10 ${step.iconColor}`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 text-center group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-stone-600 leading-relaxed mb-6 text-center">
                      {step.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-3">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${step.bgGradientFrom} ${step.bgGradientTo} flex items-center justify-center`}>
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-stone-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 ${step.bgBlur} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`} />
                </Card>
              ))}
            </div>
          </AnimatedSection>

          {/* Trust Banner Below Steps */}
          <AnimatedSection className="mt-20">
            <div className="max-w-5xl mx-auto">
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-orange-50/50 to-primary/5 shadow-2xl">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-3">
                      <div className="inline-flex p-4 rounded-2xl bg-white shadow-lg">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="font-bold text-lg text-stone-900">100% Verified</h4>
                      <p className="text-sm text-stone-600">Every temple and pandit is thoroughly vetted and certified</p>
                    </div>
                    <div className="space-y-3">
                      <div className="inline-flex p-4 rounded-2xl bg-white shadow-lg">
                        <Clock className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="font-bold text-lg text-stone-900">24/7 Support</h4>
                      <p className="text-sm text-stone-600">Round-the-clock assistance for all your spiritual needs</p>
                    </div>
                    <div className="space-y-3">
                      <div className="inline-flex p-4 rounded-2xl bg-white shadow-lg">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="font-bold text-lg text-stone-900">Satisfaction Guaranteed</h4>
                      <p className="text-sm text-stone-600">Money-back guarantee if service not completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* --- LIVE STREAMS CAROUSEL --- */}
      {liveStreams && liveStreams.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10" />
          <LiveStreamCarousel streams={liveStreams} />
        </section>
      )}

      {/* --- ENHANCED VALUE PROPOSITION --- */}
      <section className="py-24 bg-gradient-to-b from-white via-stone-50/50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Why Choose PoojaNow?
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
              Tradition Meets Technology
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              We bridge the gap between ancient spiritual practices and modern convenience, 
              making authentic rituals accessible to everyone, everywhere.
            </p>
          </div>

          <AnimatedSection className="grid md:grid-cols-3 gap-8" stagger={true} staggerDelay={100}>
            {[
              {
                icon: Shield,
                title: "100% Verified",
                description: "Every temple and pandit is thoroughly vetted. We guarantee authentic rituals performed by certified priests.",
                color: "orange",
                gradientFrom: "from-orange-500",
                gradientTo: "to-amber-500",
                backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600"
              },
              {
                icon: Video,
                title: "Live HD Streaming",
                description: "Watch your pooja being performed live in crystal-clear HD quality from the comfort of your home.",
                color: "blue",
                gradientFrom: "from-blue-500",
                gradientTo: "to-cyan-500",
                backgroundImage: "https://images.unsplash.com/photo-1603386329225-868b9f1c50ea?auto=format&fit=crop&q=80&w=600"
              },
              {
                icon: Calendar,
                title: "Flexible Booking",
                description: "Choose your preferred date and time. Reschedule easily if needed. We're here to accommodate your schedule.",
                color: "green",
                gradientFrom: "from-green-500",
                gradientTo: "to-emerald-500",
                backgroundImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=600"
              },
            ].map((feature, i) => (
              <div 
                key={i}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-white to-stone-50 border-2 border-stone-200 hover:border-primary/30 hover:shadow-2xl transition-all duration-200 overflow-hidden"
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-200">
                  <img 
                    src={feature.backgroundImage} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Hover Gradient Effect */}
                {feature.color === "orange" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
                {feature.color === "blue" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
                {feature.color === "green" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
                
                <div className="relative z-10">
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-200`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-center group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-stone-600 text-center leading-relaxed">{feature.description}</p>
                </div>
                
                {/* Decorative Corner */}
                {feature.color === "orange" && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                {feature.color === "blue" && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                {feature.color === "green" && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* --- POOJA BY EVENT SECTION --- */}
      {eventTypes && eventTypes.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-white via-stone-50 to-white border-t border-stone-200">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-medium mb-4">
                  <Sparkles className="h-3 w-3" />
                  New Feature
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
                  Pooja by Event
                </h2>
                <p className="text-stone-600 text-lg">Find the perfect pooja for festivals, life events, and special occasions</p>
              </div>
              <Link href="/poojas">
                <Button variant="ghost" className="group text-primary hover:text-primary/80 text-base">
                  Explore all events 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <AnimatedSection className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" stagger={true} staggerDelay={50}>
              {eventTypes.map((eventType: any) => {
                const icons: Record<string, any> = {
                  'festivals': Sparkles,
                  'life-events': Heart,
                  'remedial': Shield,
                  'auspicious-days': Calendar,
                  'monthly-rituals': Clock,
                  'special-occasions': Gift
                }
                const eventImages: Record<string, string> = {
                  'festivals': 'https://images.unsplash.com/photo-1603386329225-868b9f1c50ea?auto=format&fit=crop&q=80&w=400',
                  'life-events': 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=400',
                  'remedial': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=400',
                  'auspicious-days': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=400',
                  'monthly-rituals': 'https://images.unsplash.com/photo-1603386329225-868b9f1c50ea?auto=format&fit=crop&q=80&w=400',
                  'special-occasions': 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=400'
                }
                const Icon = icons[eventType.slug] || Sparkles
                const eventImage = eventImages[eventType.slug] || 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=400'
                return (
                  <Link key={eventType.id} href={`/poojas?type=${eventType.slug}`}>
                    <Card className="group hover:shadow-xl transition-all duration-200 border-2 border-stone-200 hover:border-primary/30 cursor-pointer h-full overflow-hidden relative">
                      {/* Background Image */}
                      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-200">
                        <img 
                          src={eventImage} 
                          alt={eventType.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6 text-center relative z-10">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-orange-50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-bold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                          {eventType.name}
                        </h3>
                        {eventType.description && (
                          <p className="text-xs text-stone-600 line-clamp-2">
                            {eventType.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* --- FEATURED PANDITS --- */}
      {featuredPandits && featuredPandits.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-stone-50 via-white to-stone-50 border-t border-stone-200">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-medium mb-4">
                  <Star className="h-3 w-3 fill-orange-600" />
                  Top Rated
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
                  Featured Pandits
                </h2>
                <p className="text-stone-600 text-lg">Experienced and verified priests ready to serve you</p>
              </div>
              <Link href="/pandits">
                <Button variant="ghost" className="group text-primary hover:text-primary/80 text-base">
                  View all pandits 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={true} staggerDelay={75}>
              {featuredPandits.map((pandit: any) => (
                <PanditCard 
                  key={pandit.id} 
                  pandit={{
                    ...pandit,
                    full_name: panditNamesMap.get(pandit.id) || "Pandit",
                    services: []
                  }} 
                />
              ))}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* --- FEATURED TEMPLES --- */}
      <section className="py-24 bg-gradient-to-b from-white via-stone-50 to-white border-t border-stone-200">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-medium mb-4">
                <TrendingUp className="h-3 w-3" />
                Most Popular
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
                Popular Temples
              </h2>
              <p className="text-stone-600 text-lg">Most booked destinations this week</p>
            </div>
            <Link href="/temples">
              <Button variant="ghost" className="group text-primary hover:text-primary/80 text-base">
                View all temples 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={true} staggerDelay={150}>
            {featuredTemples?.map((temple) => (
              <TempleCard key={temple.id} temple={temple} />
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <TestimonialsSection />

      {/* --- FAQ SECTION --- */}
      <section className="py-24 bg-stone-50 border-y border-stone-200">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-sm font-medium mb-6">
              <HelpCircle className="h-4 w-4" />
              Got Questions?
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-stone-600">
              Everything you need to know about booking poojas with PoojaNow
            </p>
          </div>

          <AnimatedSection className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto" stagger={true} staggerDelay={50}>
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="group p-6 rounded-2xl bg-white border-2 border-stone-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover-lift"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HelpCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-stone-900 mb-2 group-hover:text-primary transition-colors">
                      {faq.question}
                    </h3>
                    <p className="text-stone-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* --- ULTRA ENHANCED CTA --- */}
      <section className="py-32 bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white overflow-hidden relative">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl animate-pulse delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <AnimatedSection className="container px-4 mx-auto relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-8 shadow-lg animate-bounce-in">
              <Heart className="h-4 w-4 fill-white animate-pulse" />
              Join Our Growing Community
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Your spiritual journey
              <br />
              <span className="text-amber-200 bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200 bg-clip-text text-transparent animate-gradient">
                starts here.
              </span>
            </h2>
            
            <p className="text-orange-50 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Join thousands of devotees who trust PoojaNow for their daily prayers, 
              special occasions, and spiritual consultations. Experience the divine from anywhere.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/login?tab=signup">
                <Button size="lg" className="group relative h-16 px-12 rounded-full bg-white text-orange-600 hover:bg-stone-100 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-110 hover:-translate-y-2 overflow-hidden animate-glow-pulse">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/temples">
                <Button size="lg" variant="outline" className="h-16 px-12 rounded-full border-2 border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-semibold text-lg transition-all hover:scale-110 hover:-translate-y-1 shadow-lg">
                  Explore Temples
                </Button>
              </Link>
            </div>

            {/* Enhanced Trust Badges */}
            <AnimatedSection className="flex flex-wrap items-center justify-center gap-8 text-white/90" stagger={true} staggerDelay={50}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <Shield className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <MessageCircle className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <Gift className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">Free Prasad Delivery</span>
              </div>
            </AnimatedSection>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
