import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { TempleCard } from "@/components/temple-card";
import { ArrowRight, Star, ShieldCheck, Tv, Sparkles } from "lucide-react";

export default async function Home() {
  const supabase = createClient();
  
  // Fetch featured temples
  const { data: featuredTemples } = await supabase
    .from("temples")
    .select("*")
    .eq("status", "published")
    .limit(3);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-gradient">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 border border-orange-200 text-orange-800 text-xs font-medium uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                <span>Spiritual Technology</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.1]">
                Bring the <span className="text-primary italic">Divine</span> <br/>
                to your doorstep.
              </h1>
              
              <p className="text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience authentic Vedic rituals performed by verified pandits. 
                Book online poojas, watch live darshans, and connect with your faith effortlessly.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/temples">
                  <Button size="lg" className="h-14 px-8 rounded-full text-base bg-primary hover:bg-orange-700 shadow-orange-200 shadow-xl transition-all hover:scale-105">
                    Book a Pooja
                  </Button>
                </Link>
                <Link href="/live">
                  <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base border-stone-200 hover:bg-white hover:text-primary transition-all">
                    <Tv className="mr-2 h-4 w-4" />
                    Live Darshan
                  </Button>
                </Link>
              </div>

              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-stone-500 text-sm">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-stone-200" />
                        ))}
                    </div>
                    <span>10k+ Devotees</span>
                </div>
                <div className="h-4 w-px bg-stone-300" />
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-stone-900">4.9/5</span>
                    <span>Rating</span>
                </div>
              </div>
            </div>

            {/* Visual/Image Area */}
            <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
                <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                    {/* Placeholder for high-quality hero image */}
                    <div className="absolute inset-0 bg-stone-200 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/20 to-transparent" />
                    
                    {/* Floating Cards */}
                    <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-xl border border-white/40 shadow-lg backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                <div className="h-6 w-6">🕉️</div>
                            </div>
                            <div>
                                <p className="font-heading font-bold text-lg">Rudrabhishek Pooja</p>
                                <p className="text-sm text-stone-600">Kashi Vishwanath • Live Now</p>
                            </div>
                            <Button size="sm" className="ml-auto rounded-full">Join</Button>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-orange-400/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* --- VALUE PROPOSITION (Bento Grid Style) --- */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Spiritual services, reimagined.</h2>
                <p className="text-stone-600">We combine ancient traditions with modern convenience to bring you a seamless spiritual experience.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="md:col-span-2 bg-stone-50 rounded-3xl p-8 border border-stone-100 relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="relative z-10">
                        <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-primary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">100% Verified Pandits</h3>
                        <p className="text-stone-600 max-w-md">Every pandit on our platform undergoes a rigorous verification process, including background checks and vedic knowledge assessment.</p>
                    </div>
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-orange-100/50 to-transparent rounded-tl-full translate-x-1/3 translate-y-1/3 group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Card 2 */}
                <div className="bg-stone-900 text-white rounded-3xl p-8 relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="relative z-10">
                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white">
                            <Tv className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">HD Live Streaming</h3>
                        <p className="text-stone-400">Crystal clear darshan from anywhere in the world.</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Card 3 */}
                <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 group hover:shadow-lg transition-all">
                    <h3 className="text-xl font-bold mb-2 text-orange-900">Secure Payments</h3>
                    <p className="text-orange-700/80 text-sm mb-4">Your dakshina is safe with us until the service is completed.</p>
                    <div className="h-32 bg-white rounded-xl border border-orange-100 shadow-sm flex items-center justify-center text-stone-300 text-sm">
                        Payment UI Mockup
                    </div>
                </div>

                {/* Card 4 */}
                <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm group hover:shadow-lg transition-all">
                     <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">Global Temple Network</h3>
                            <p className="text-stone-600 mb-6">Access poojas at Kashi Vishwanath, Siddhivinayak, and 50+ other major temples across India.</p>
                            <Button variant="outline" className="rounded-full">Explore Temples</Button>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-3 opacity-80">
                            <div className="h-24 bg-stone-100 rounded-lg" />
                            <div className="h-24 bg-stone-100 rounded-lg translate-y-4" />
                            <div className="h-24 bg-stone-100 rounded-lg" />
                            <div className="h-24 bg-stone-100 rounded-lg translate-y-4" />
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FEATURED TEMPLES (Horizontal Scroll) --- */}
      <section className="py-24 bg-stone-50 border-t border-stone-200">
        <div className="container px-4 mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
                <h2 className="text-3xl font-bold mb-2">Sacred Destinations</h2>
                <p className="text-stone-600">Book poojas at the most revered temples.</p>
            </div>
            <Link href="/temples">
                <Button variant="ghost" className="hidden sm:flex group">
                    View all temples <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTemples?.map((temple) => (
                <div key={temple.id} className="group cursor-pointer">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 mb-4 relative">
                         {/* Image Placeholder */}
                         {temple.hero_image_path && (
                             <img src={temple.hero_image_path} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         )}
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {temple.city}
                         </div>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{temple.name}</h3>
                    <p className="text-stone-500 text-sm mt-1 line-clamp-2">{temple.description}</p>
                </div>
            ))}
          </div>
          
          <div className="mt-8 sm:hidden">
            <Link href="/temples">
                <Button variant="outline" className="w-full">View all temples</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 bg-stone-900 text-white overflow-hidden relative">
        <div className="container px-4 mx-auto relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Begin your journey today.
            </h2>
            <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Join our community of devotees and experience the peace of mind that comes with authentic spiritual services.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login?tab=signup">
                    <Button size="lg" className="h-14 px-10 rounded-full bg-white text-stone-900 hover:bg-stone-100 font-bold text-lg">
                        Sign Up Free
                    </Button>
                </Link>
            </div>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      </section>
    </div>
  );
}
