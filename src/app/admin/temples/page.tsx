import { createClient } from "@/utils/supabase/server"
import { CreateTempleDialog } from "./create-temple-dialog"
import { TempleStatusToggle } from "./temple-status-toggle"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

export default async function AdminTemplesPage() {
  const supabase = createClient()
  
  const { data: temples } = await supabase
    .from("temples")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Temples</h1>
        <CreateTempleDialog />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Deity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {temples?.map((temple) => (
              <TableRow key={temple.id}>
                <TableCell className="font-medium">
                  {temple.name}
                  <div className="text-xs text-muted-foreground">{temple.slug}</div>
                </TableCell>
                <TableCell>
                  {temple.city}, {temple.state}
                </TableCell>
                <TableCell>{temple.deity}</TableCell>
                <TableCell>
                  <TempleStatusToggle templeId={temple.id} initialStatus={temple.status || 'draft'} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!temples || temples.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No temples found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

