import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { TempleCard } from "@/components/temple-card";
import { LiveStreamCarousel } from "@/components/live-stream-carousel";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ArrowRight, CheckCircle2, Shield, Video, Sparkles, Users, Calendar } from "lucide-react";

export default async function Home() {
  const supabase = createClient();
  
  // Parallel Data Fetching
  const [templesRes, streamsRes] = await Promise.all([
    supabase.from("temples").select("*").eq("status", "published").limit(3),
    supabase.from("streams").select("*, temples(name, city)").eq("status", "live").order("viewer_count", { ascending: false }).limit(6)
  ]);

  const featuredTemples = templesRes.data;
  const liveStreams = streamsRes.data;

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-gradient">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 border border-orange-200 text-orange-800 text-xs font-medium uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Sparkles className="h-3 w-3" />
                <span>India's #1 Spiritual Platform</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.1] animate-in fade-in slide-in-from-bottom-5 duration-700">
                Connect with the <span className="text-primary italic">Divine</span> <br/>
                from anywhere.
              </h1>
              
              <p className="text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Book authentic poojas at verified temples, watch live aartis, and consult with experienced pandits. 100% Secure & Verified.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <Link href="/temples">
                  <Button size="lg" className="h-14 px-8 rounded-full text-base bg-primary hover:bg-orange-700 shadow-orange-200 shadow-xl transition-all hover:scale-105">
                    Book a Pooja
                  </Button>
                </Link>
                <Link href="/pandits">
                  <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base border-stone-200 hover:bg-white hover:text-primary transition-all">
                    Find a Pandit
                  </Button>
                </Link>
              </div>

              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-stone-500 text-sm animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>10k+ Happy Devotees</span>
                </div>
                <div className="h-4 w-px bg-stone-300" />
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Verified Services</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xl lg:max-w-none relative animate-in fade-in zoom-in duration-1000">
                <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 ease-out border-4 border-white">
                    <img 
                        src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1000" 
                        alt="Temple Aarti" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/40 to-transparent" />
                    
                    <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-xl border border-white/40 shadow-lg backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                <div className="h-6 w-6">🕉️</div>
                            </div>
                            <div>
                                <p className="font-heading font-bold text-lg text-stone-900">Evening Aarti</p>
                                <p className="text-sm text-stone-600">Kashi Vishwanath • Live</p>
                            </div>
                            <Link href="/live" className="ml-auto">
                                <Button size="sm" className="rounded-full bg-red-600 hover:bg-red-700 text-white border-0">Watch</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE STREAMS CAROUSEL --- */}
      {liveStreams && liveStreams.length > 0 && (
        <section className="py-12 bg-stone-900 text-white overflow-hidden">
            <LiveStreamCarousel streams={liveStreams} />
        </section>
      )}

      {/* --- VALUE PROPOSITION --- */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose PoojaNow?</h2>
                <p className="text-stone-600">We bridge the gap between tradition and technology.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-orange-50/50 border border-orange-100 hover:shadow-lg transition-all text-center group">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-primary group-hover:scale-110 transition-transform">
                        <Shield className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">100% Verified</h3>
                    <p className="text-stone-600">Every temple and pandit is vetted. We guarantee authentic rituals.</p>
                </div>
                <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 hover:shadow-lg transition-all text-center group">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                        <Video className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Live Streaming</h3>
                    <p className="text-stone-600">Watch your pooja being performed live in HD quality from home.</p>
                </div>
                <div className="p-8 rounded-3xl bg-green-50/50 border border-green-100 hover:shadow-lg transition-all text-center group">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-green-600 group-hover:scale-110 transition-transform">
                        <Calendar className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Flexible Booking</h3>
                    <p className="text-stone-600">Choose your preferred date and time. Reschedule easily if needed.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- FEATURED TEMPLES --- */}
      <section className="py-24 bg-stone-50 border-t border-stone-200">
        <div className="container px-4 mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
                <h2 className="text-3xl font-bold mb-2">Popular Temples</h2>
                <p className="text-stone-600">Most booked destinations this week.</p>
            </div>
            <Link href="/temples">
                <Button variant="ghost" className="hidden sm:flex group text-primary">
                    View all <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTemples?.map((temple) => (
                <TempleCard key={temple.id} temple={temple} />
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <TestimonialsSection />

      {/* --- CTA --- */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="container px-4 mx-auto relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Your spiritual journey starts here.
            </h2>
            <p className="text-orange-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Join thousands of devotees who trust PoojaNow for their daily prayers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login?tab=signup">
                    <Button size="lg" className="h-14 px-10 rounded-full bg-white text-primary hover:bg-stone-100 font-bold text-lg shadow-xl">
                        Get Started
                    </Button>
                </Link>
            </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </section>
    </div>
  );
}
