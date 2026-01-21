import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { UserNav } from "@/components/user-nav" // Assuming this exists or we simplify
import { Menu } from "lucide-react"

export async function Navbar() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between mt-4 rounded-2xl glass px-6 shadow-sm">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold text-lg group-hover:scale-110 transition-transform">
                P
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-stone-900">
                PoojaNow
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['Temples', 'Pandits', 'Live'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className="text-sm font-medium text-stone-600 hover:text-primary transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
          
          {/* Auth / CTA */}
          <div className="flex items-center gap-4">
            {user ? (
               <Link href="/u/bookings">
                  <div className="h-9 w-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-sm font-medium text-stone-700 hover:bg-stone-200 transition-colors">
                      {user.email?.[0].toUpperCase()}
                  </div>
               </Link>
            ) : (
              <div className="flex items-center gap-3">
                  <Link href="/login" className="hidden sm:block text-sm font-medium text-stone-600 hover:text-stone-900">
                      Log in
                  </Link>
                  <Link href="/login?tab=signup">
                      <Button className="rounded-full px-6 bg-stone-900 text-white hover:bg-stone-800 shadow-lg hover:shadow-xl transition-all">
                          Get Started
                      </Button>
                  </Link>
              </div>
            )}
            <button className="md:hidden text-stone-600">
                <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
