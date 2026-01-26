import { createClient } from "@/utils/supabase/server"
import { NavbarClient } from "@/components/navbar-client"

export async function Navbar() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <NavbarClient user={user} />
}
