"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";

export interface Field { key: string; label: string; type?: string; placeholder?: string; }

export function ResourcePage<T extends { id: string }>({
  title, description, endpoint, fields, columns,
}: {
  title: string; description: string; endpoint: string;
  fields: Field[]; columns: { key: string; label: string; render?: (row: T) => React.ReactNode }[];
}) {
  const [data, setData] = useState<T[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<any>({});

  async function load() {
    try { setData(await api<T[]>(`${endpoint}?q=${encodeURIComponent(q)}`)); }
    catch(e:any) { toast.error(e.message); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [q]);

  function openCreate() { setEditing(null); setForm({}); setOpen(true); }
  function openEdit(row: T) { setEditing(row); setForm(row); setOpen(true); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload: any = { ...form };
      fields.forEach(f => { if (f.type === "number" && payload[f.key] != null) payload[f.key] = Number(payload[f.key]); });
      if (editing) await api(`${endpoint}/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      else await api(endpoint, { method: "POST", body: JSON.stringify(payload) });
      toast.success("Saved"); setOpen(false); load();
    } catch (e: any) { toast.error(e.message); }
  }
  async function remove(id: string) {
    if (!confirm("Delete this record?")) return;
    try { await api(`${endpoint}/${id}`, { method: "DELETE" }); toast.success("Deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openCreate}><Plus className="h-4 w-4" /> New</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? `Edit ${title.slice(0,-1)}` : `New ${title.slice(0,-1)}`}</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="grid gap-4 grid-cols-2">
              {fields.map(f => (
                <div key={f.key} className={f.type === "textarea" ? "col-span-2" : ""}>
                  <Label className="mb-1.5 block">{f.label}</Label>
                  <Input type={f.type || "text"} placeholder={f.placeholder}
                    value={form[f.key] ?? ""} onChange={e=>setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div className="col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
                <Button type="submit">{editing ? "Save" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">All {title}</CardTitle>
          <div className="relative w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <THead><TR>
              {columns.map(c => <TH key={c.key}>{c.label}</TH>)}
              <TH className="text-right">Actions</TH>
            </TR></THead>
            <TBody>
              {data.map((row: any) => (
                <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b hover:bg-muted/40 transition-colors">
                  {columns.map(c => <TD key={c.key}>{c.render ? c.render(row) : row[c.key]}</TD>)}
                  <TD className="text-right">
                    <Button variant="ghost" size="icon" onClick={()=>openEdit(row)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={()=>remove(row.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TD>
                </motion.tr>
              ))}
              {data.length === 0 && <TR><TD colSpan={columns.length+1} className="text-center py-12 text-muted-foreground">No records yet. Create your first one.</TD></TR>}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
