"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Menu, 
  X, 
  Home, 
  Building2, 
  Users, 
  Radio, 
  Calendar, 
  LogOut,
  ChevronDown,
  Sparkles
} from "lucide-react"
import { signout } from "@/app/auth/actions"
import { cn } from "@/lib/utils"

interface NavbarClientProps {
  user: {
    id: string
    email?: string
  } | null
}

export function NavbarClient({ user }: NavbarClientProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { name: "Temples", href: "/temples", icon: Building2 },
    { name: "Pandits", href: "/pandits", icon: Users },
    { name: "Pooja by Event", href: "/poojas", icon: Sparkles },
    { name: "Live", href: "/live", icon: Radio },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled 
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-stone-200/50" 
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex h-20 items-center justify-between transition-all duration-300",
            isScrolled ? "mt-0" : "mt-2"
          )}>
            {/* Logo */}
            <div className="flex-shrink-0 z-50">
              <Link 
                href="/" 
                className="flex items-center gap-3 group relative"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100" />
                  <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-heading font-bold text-lg group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-xl">
                    P
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-xl font-bold tracking-tight text-stone-900 group-hover:text-primary transition-colors">
                    PoojaNow
                  </span>
                  <span className="text-[10px] text-stone-500 -mt-1 hidden sm:block">
                    Divine Connections
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative group",
                  isActive("/") && pathname === "/"
                    ? "text-primary bg-primary/10"
                    : "text-stone-600 hover:text-primary hover:bg-stone-100"
                )}
              >
                <Home className="h-4 w-4" />
                Home
                {isActive("/") && pathname === "/" && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative group",
                      active
                        ? "text-primary bg-primary/10"
                        : "text-stone-600 hover:text-primary hover:bg-stone-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                    {active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 relative z-50">
              {/* User Menu / Auth */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 h-10 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-all group">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                        {user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-stone-700 max-w-[120px] truncate">
                        {user.email?.split("@")[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-stone-500 hidden sm:block group-hover:text-stone-700 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">My Account</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/u/bookings" className="cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <form action={signout}>
                      <DropdownMenuItem asChild>
                        <button type="submit" className="w-full cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </button>
                      </DropdownMenuItem>
                    </form>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    href="/login" 
                    className="hidden sm:block text-sm font-medium text-stone-600 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-stone-100"
                  >
                    Log in
                  </Link>
                  <Link href="/login?tab=signup">
                    <Button className="rounded-lg px-5 bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 shadow-lg hover:shadow-xl transition-all font-medium">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg text-stone-600 hover:text-primary hover:bg-stone-100 transition-colors relative z-50 touch-manipulation cursor-pointer active:scale-95"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-6 space-y-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-heading font-bold text-sm">
                  P
                </div>
                <span className="font-heading text-lg font-bold text-stone-900">
                  PoojaNow
                </span>
              </Link>
            </div>

            {/* Mobile Nav Items */}
            <nav className="space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all",
                  isActive("/") && pathname === "/"
                    ? "text-primary bg-primary/10"
                    : "text-stone-700 hover:text-primary hover:bg-stone-100"
                )}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all",
                      active
                        ? "text-primary bg-primary/10"
                        : "text-stone-700 hover:text-primary hover:bg-stone-100"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Auth */}
            {user ? (
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-stone-900">
                    {user.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-stone-500 truncate">{user.email}</p>
                </div>
                <Link
                  href="/u/bookings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-stone-700 hover:text-primary hover:bg-stone-100 transition-all"
                >
                  <Calendar className="h-5 w-5" />
                  My Bookings
                </Link>
                <form action={signout}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium text-stone-700 hover:text-primary hover:bg-stone-100 transition-all"
                >
                  Log in
                </Link>
                <Link
                  href="/login?tab=signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 transition-all shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-20" />
    </>
  )
}

