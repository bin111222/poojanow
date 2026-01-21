import { createClient } from "@/utils/supabase/server"
import { PanditActionButtons } from "./pandit-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function AdminPanditsPage() {
  const supabase = createClient()
  
  const { data: pandits } = await supabase
    .from("pandit_profiles")
    .select(`
      *,
      profiles:id (full_name, email, phone)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Pandit Verification</h1>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pandit</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pandits?.map((pandit) => (
              <TableRow key={pandit.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={pandit.profile_image_path || ""} />
                        <AvatarFallback>{pandit.profiles?.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{pandit.profiles?.full_name}</div>
                        <div className="text-xs text-muted-foreground">{pandit.profiles?.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {pandit.city}, {pandit.state}
                </TableCell>
                <TableCell>
                   <Badge variant={pandit.profile_status === 'published' ? 'default' : 'secondary'}>
                        {pandit.profile_status}
                   </Badge>
                </TableCell>
                <TableCell>
                   <Badge variant={
                       pandit.verification_status === 'verified' ? 'outline' : 
                       pandit.verification_status === 'rejected' ? 'destructive' : 'secondary'
                   } className={pandit.verification_status === 'verified' ? 'border-green-500 text-green-600' : ''}>
                        {pandit.verification_status}
                   </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <PanditActionButtons panditId={pandit.id} />
                </TableCell>
              </TableRow>
            ))}
            {(!pandits || pandits.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No pandits found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

