import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { manageDataSource } from "@/lib/functions";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Source = { id: string; type: string; display_name: string; status: string; created_at: string };

export default function DataSources() {
  const qc = useQueryClient();
  const { data } = useQuery<Source[]>({
    queryKey: ["sources"],
    queryFn: async () => [],
    initialData: [],
  });
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Shopify");
  const [displayName, setDisplayName] = useState("");
  const [credentials, setCredentials] = useState("");

  async function onSubmit() {
    const res = await manageDataSource({ type, display_name: displayName || type, credentials });
    const created_at = (res as any)?.created_at || new Date().toISOString();
    const status = (res as any)?.status || "connected";
    const next = [{ id: (res as any)?.id || String(Date.now()), type, display_name: displayName || type, status, created_at }, ...(data || [])];
    qc.setQueryData(["sources"], next);
    setOpen(false);
    setDisplayName("");
    setCredentials("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">Data Sources</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">Add New Source</Button>
          </DialogTrigger>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle>Connect Data Source</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Type</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shopify">Shopify</SelectItem>
                    <SelectItem value="Google Analytics">Google Analytics</SelectItem>
                    <SelectItem value="Stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Display Name</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="My Shopify Store" className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Credentials</label>
                <Input value={credentials} onChange={(e) => setCredentials(e.target.value)} placeholder="API Key or Token" className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={onSubmit}>Connect</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <GlassCard variant="hover" className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">No sources yet</TableCell>
              </TableRow>
            ) : (
              (data || []).map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.type}</TableCell>
                  <TableCell>{s.display_name}</TableCell>
                  <TableCell>{s.status}</TableCell>
                  <TableCell className="text-right">{s.created_at ? new Date(s.created_at).toLocaleString() : "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
}
