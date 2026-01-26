import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

// This layout allows access without admin role
export default async function GrantAccessLayout({
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
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 h-16 flex items-center px-6 sticky top-0 z-30">
        <div className="font-bold text-xl flex items-center gap-2">
            <div className="h-8 w-8 bg-stone-900 rounded-lg flex items-center justify-center text-white text-sm">A</div>
            <span>Admin Console</span>
        </div>
        <div className="ml-auto text-sm text-stone-500">
            {user.email}
        </div>
      </header>
      <div className="flex">
        <main className="flex-1 p-6 md:p-8 overflow-auto max-w-4xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}


