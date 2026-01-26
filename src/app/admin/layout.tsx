import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"
import { ShieldAlert } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Verify role is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Allow access to grant-access page without admin role
  // This is handled by a separate layout in /admin/grant-access/layout.tsx
  
  if (profile?.role !== 'admin') {
    // In a real app, you might show a 403 page or redirect to home
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-stone-100">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                    <ShieldAlert className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-stone-900 mb-2">Access Denied</h1>
                <p className="text-stone-600 mb-6">You do not have permission to access the Admin Console.</p>
                <div className="flex flex-col gap-3">
                  <a href="/admin/grant-access" className="text-primary font-medium hover:underline bg-primary/10 px-4 py-2 rounded-lg">
                    Grant Admin Access
                  </a>
                  <a href="/" className="text-stone-600 font-medium hover:underline">Return to Home</a>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 h-16 flex items-center px-6 sticky top-0 z-40">
        <div className="font-bold text-xl flex items-center gap-2">
            <div className="h-8 w-8 bg-stone-900 rounded-lg flex items-center justify-center text-white text-sm">A</div>
            <span>Admin Console</span>
        </div>
        <div className="ml-auto text-sm text-stone-500">
            {user.email}
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 bg-white border-r border-stone-200 min-h-[calc(100vh-4rem)] hidden md:block sticky top-16 self-start z-30">
          <div className="p-4">
             <AdminNav />
          </div>
        </aside>
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

