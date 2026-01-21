import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/user-nav"

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
             <div className="mb-6 px-4">
               <h2 className="font-semibold text-lg">My Account</h2>
               <p className="text-sm text-muted-foreground truncate">{user.email}</p>
             </div>
             <UserNav />
          </div>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

