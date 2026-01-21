import Link from "next/link"
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signout } from "@/app/auth/actions"

export function AdminNav() {
  return (
    <nav className="flex flex-col space-y-2">
      <Link href="/admin">
        <Button variant="ghost" className="w-full justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Overview
        </Button>
      </Link>
      <Link href="/admin/temples">
        <Button variant="ghost" className="w-full justify-start">
          <Building2 className="mr-2 h-4 w-4" />
          Temples
        </Button>
      </Link>
      <Link href="/admin/pandits">
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Pandits
        </Button>
      </Link>
      <Link href="/admin/bookings">
        <Button variant="ghost" className="w-full justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          Bookings
        </Button>
      </Link>
      <Link href="/admin/settings">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </Link>
      
      <div className="pt-4 mt-4 border-t">
        <form action={signout}>
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
            </Button>
        </form>
      </div>
    </nav>
  )
}

