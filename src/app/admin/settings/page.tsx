import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Bell, 
  Shield, 
  Mail, 
  Database,
  Key,
  Globe,
  CreditCard
} from "lucide-react"

export default async function AdminSettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Settings</h1>
        <p className="text-stone-600 mt-1">Manage platform settings and configurations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform_name">Platform Name</Label>
              <Input id="platform_name" defaultValue="PoojaNow" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform_email">Platform Email</Label>
              <Input id="platform_email" type="email" defaultValue="admin@poojanow.com" />
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email_notifications">Email Notifications</Label>
              <Input id="email_notifications" type="email" defaultValue={user?.email || ''} />
            </div>
            <div className="space-y-2">
              <Label>Notification Types</Label>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>New bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Payment received</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>System alerts</span>
                </div>
              </div>
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Security and access control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
              <Input id="session_timeout" type="number" defaultValue="60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
              <Input id="max_login_attempts" type="number" defaultValue="5" />
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
            <CardDescription>Payment gateway configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment_gateway">Payment Gateway</Label>
              <Input id="payment_gateway" defaultValue="Razorpay" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_rate">Platform Commission (%)</Label>
              <Input id="commission_rate" type="number" defaultValue="10" />
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Database Provider:</span>
              <span className="font-medium">Supabase</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-stone-600">Last Backup:</span>
              <span className="font-medium">Not configured</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


