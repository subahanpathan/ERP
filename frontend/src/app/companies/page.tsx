"use client";
import { AppShell } from "@/components/layout/shell";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import { Building2, Check, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CompaniesPage() {
  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});
  const { companyId, setCompany } = useAuth();
  async function load() { setList(await api("/api/companies")); }
  useEffect(() => { load(); }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try { await api("/api/companies", { method: "POST", body: JSON.stringify(form) }); toast.success("Company created"); setOpen(false); setForm({}); load(); }
    catch(e:any){ toast.error(e.message); }
  }
  async function del(id: string) {
    if (!confirm("Delete company and all its data?")) return;
    await api(`/api/companies/${id}`, { method: "DELETE" }); toast.success("Deleted"); load();
  }
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Companies</h1>
            <p className="text-muted-foreground mt-1">Manage up to 5 companies — pick one to start working.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> New Company</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Company</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                {[
                  ["name","Name"],["gstNumber","GST Number"],["address","Address"],
                  ["state","State"],["phone","Phone"],["email","Email"],["financialYear","Financial Year"]
                ].map(([k,l]) => (
                  <div key={k} className={k==="address" ? "col-span-2" : ""}>
                    <Label className="mb-1.5 block">{l}</Label>
                    <Input value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})} required={k==="name"} />
                  </div>
                ))}
                <div className="col-span-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}>
              <Card className={`relative overflow-hidden ${companyId === c.id ? "ring-2 ring-primary" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center"><Building2 className="h-5 w-5 text-primary" /></div>
                    {companyId === c.id && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1"><Check className="h-3 w-3" />Active</span>}
                  </div>
                  <CardTitle className="mt-3">{c.name}</CardTitle>
                  <CardDescription>{c.gstNumber || "GST not set"} · {c.state || "—"}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <Button size="sm" variant={companyId===c.id ? "secondary" : "default"} onClick={()=>{ setCompany(c.id); toast.success("Switched to " + c.name); }}>
                    {companyId===c.id ? "Selected" : "Select"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={()=>del(c.id)}><Trash2 className="h-4 w-4" /></Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {list.length === 0 && <Card><CardContent className="py-12 text-center text-muted-foreground">No companies yet. Create one to start.</CardContent></Card>}
        </div>
      </div>
    </AppShell>
  );
}
