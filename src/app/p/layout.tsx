import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { PanditNav } from "@/components/pandit-nav"

export default async function PanditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Verify role is pandit
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'pandit') {
    redirect("/") // Or unauthorized page
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
             <div className="mb-6 px-4">
               <h2 className="font-semibold text-lg">Pandit Portal</h2>
               <p className="text-sm text-muted-foreground truncate">{user.email}</p>
             </div>
             <PanditNav />
          </div>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

