"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { inr } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function VoucherForm({ mode }: { mode: "sales" | "purchases" }) {
  const router = useRouter();
  const partyLabel = mode === "sales" ? "Customer" : "Supplier";
  const partyEndpoint = mode === "sales" ? "/api/customers" : "/api/suppliers";
  const [parties, setParties] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [partyId, setPartyId] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<any[]>([{ itemId: "", quantity: 1, rate: 0, gst: 18 }]);

  useEffect(() => {
    api(partyEndpoint).then(setParties).catch(()=>{});
    api("/api/items").then(setItems).catch(()=>{});
  }, [partyEndpoint]);

  function updateLine(i: number, patch: any) {
    setLines(l => l.map((x, idx) => idx===i ? { ...x, ...patch } : x));
  }
  function pickItem(i: number, itemId: string) {
    const it = items.find(x => x.id === itemId);
    if (!it) return updateLine(i, { itemId });
    updateLine(i, { itemId, rate: mode === "sales" ? it.sellingPrice : it.purchasePrice, gst: it.gstPercentage });
  }
  const totals = lines.reduce((acc, l) => {
    const base = (Number(l.quantity)||0) * (Number(l.rate)||0);
    const gst = base * ((Number(l.gst)||0)/100);
    acc.subtotal += base; acc.gstTotal += gst; acc.total += base + gst;
    return acc;
  }, { subtotal: 0, gstTotal: 0, total: 0 });

  async function submit() {
    try {
      if (!partyId) return toast.error(`Select a ${partyLabel.toLowerCase()}`);
      if (lines.some(l => !l.itemId)) return toast.error("Select an item on every line");
      const body = {
        [mode === "sales" ? "customerId" : "supplierId"]: partyId,
        notes,
        items: lines.map(l => ({ itemId: l.itemId, quantity: Number(l.quantity), rate: Number(l.rate), gst: Number(l.gst) })),
      };
      await api(`/api/${mode}`, { method: "POST", body: JSON.stringify(body) });
      toast.success("Voucher created");
      router.push(`/${mode}`);
    } catch (e:any) { toast.error(e.message); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader><CardTitle>{mode === "sales" ? "Sales" : "Purchase"} Voucher</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">{partyLabel}</Label>
              <select className="h-9 w-full rounded-lg border bg-background px-3 text-sm" value={partyId} onChange={e=>setPartyId(e.target.value)}>
                <option value="">Select…</option>
                {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <Label className="mb-1.5 block">Notes</Label>
              <Input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional remarks" />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Line Items</Label>
            <div className="rounded-xl border overflow-hidden">
              <div className="grid grid-cols-[1fr_80px_100px_70px_110px_40px] gap-2 px-3 py-2 bg-muted/40 text-xs uppercase text-muted-foreground">
                <div>Item</div><div>Qty</div><div>Rate</div><div>GST%</div><div className="text-right">Amount</div><div></div>
              </div>
              {lines.map((l, i) => {
                const base = (Number(l.quantity)||0) * (Number(l.rate)||0);
                const amt = base * (1 + (Number(l.gst)||0)/100);
                return (
                  <div key={i} className="grid grid-cols-[1fr_80px_100px_70px_110px_40px] gap-2 p-2 border-t items-center">
                    <select className="h-9 rounded-md border bg-background px-2 text-sm" value={l.itemId} onChange={e=>pickItem(i, e.target.value)}>
                      <option value="">Select item…</option>
                      {items.map(it => <option key={it.id} value={it.id}>{it.name} ({it.sku})</option>)}
                    </select>
                    <Input type="number" value={l.quantity} onChange={e=>updateLine(i,{quantity:e.target.value})} />
                    <Input type="number" value={l.rate} onChange={e=>updateLine(i,{rate:e.target.value})} />
                    <Input type="number" value={l.gst} onChange={e=>updateLine(i,{gst:e.target.value})} />
                    <div className="text-right text-sm font-medium tabular-nums">{inr(amt)}</div>
                    <Button variant="ghost" size="icon" onClick={()=>setLines(lines.filter((_,j)=>j!==i))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" size="sm" onClick={()=>setLines([...lines, { itemId:"", quantity:1, rate:0, gst:18 }])}>
              <Plus className="h-4 w-4" /> Add line
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit sticky top-20">
        <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{inr(totals.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span className="tabular-nums">{inr(totals.gstTotal)}</span></div>
          <div className="flex justify-between text-base font-semibold border-t pt-3"><span>Total</span><span className="tabular-nums">{inr(totals.total)}</span></div>
          <Button className="w-full mt-3" onClick={submit}>Save Voucher</Button>
        </CardContent>
      </Card>
    </div>
  );
}
