import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { grantAdminAccess } from "./actions"
import { GrantAccessForm } from "@/components/admin/grant-access-form"

export default async function GrantAccessPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600 mb-4">You need to be logged in to grant admin access.</p>
            <Button asChild>
              <a href="/login">Go to Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check current role
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, role, is_active')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Grant Admin Access</h1>
        <p className="text-stone-600">Grant admin access to your account or another user</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Current Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-stone-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Current Role</p>
            <p className="font-medium">
              {profile?.role || 'No profile found'}
              {profile?.role === 'admin' && (
                <span className="ml-2 text-green-600">✓ You already have admin access</span>
              )}
            </p>
          </div>
          {profile?.role !== 'admin' && (
            <GrantAccessForm email={user.email || ''} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grant Admin to Another User</CardTitle>
        </CardHeader>
        <CardContent>
          <GrantAccessForm />
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-900">🚨 DIRECT SQL FIX (If Button Doesn't Work)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-800 font-semibold mb-4">
            If the button above doesn't work, use this SQL method instead:
          </p>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-red-900 mb-2">Step 1: Find Your Email</p>
              <div className="bg-white p-3 rounded-lg border border-red-300 font-mono text-xs overflow-x-auto">
                <code>SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;</code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-red-900 mb-2">Step 2: Grant Admin (Replace YOUR_EMAIL)</p>
              <div className="bg-white p-3 rounded-lg border border-red-300 font-mono text-xs overflow-x-auto">
                <code className="whitespace-pre">
{`UPDATE profiles
SET role = 'admin', is_active = true
WHERE email = 'YOUR_EMAIL@example.com';`}
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-red-900 mb-2">Step 3: If Profile Doesn't Exist</p>
              <div className="bg-white p-3 rounded-lg border border-red-300 font-mono text-xs overflow-x-auto">
                <code className="whitespace-pre">
{`-- First get your user ID from Step 1, then:
INSERT INTO profiles (id, email, full_name, role, is_active)
VALUES (
  'YOUR_USER_ID_FROM_STEP_1',
  'YOUR_EMAIL@example.com',
  'Admin User',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_active = true;`}
                </code>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-red-900 mb-2">Step 4: Fix RLS Policy (Run This First)</p>
              <div className="bg-white p-3 rounded-lg border border-red-300 font-mono text-xs overflow-x-auto">
                <code className="whitespace-pre">
{`DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);`}
                </code>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-xs text-yellow-900">
              <strong>Quick Steps:</strong><br/>
              1. Go to Supabase Dashboard → SQL Editor<br/>
              2. Run Step 4 (RLS Policy) first<br/>
              3. Run Step 1 to find your email<br/>
              4. Run Step 2 with your actual email<br/>
              5. Refresh this page
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

