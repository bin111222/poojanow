import Link from "next/link"
import { User, Calendar, CreditCard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signout } from "@/app/auth/actions"

export function UserNav() {
  return (
    <nav className="flex flex-col space-y-2">
      <Link href="/u/bookings">
        <Button variant="ghost" className="w-full justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          My Bookings
        </Button>
      </Link>
      <Link href="/u/payments">
        <Button variant="ghost" className="w-full justify-start">
          <CreditCard className="mr-2 h-4 w-4" />
          Payments
        </Button>
      </Link>
      <Link href="/u/profile">
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
      </Link>
      <form action={signout}>
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </form>
    </nav>
  )
}

