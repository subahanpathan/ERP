"use client";
import { AppShell } from "@/components/layout/shell";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import Link from "next/link";
import { Plus } from "lucide-react";
import { inr } from "@/lib/utils";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => { api("/api/purchases").then(setData).catch(()=>{}); }, []);
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Purchase Vouchers</h1>
            <p className="text-muted-foreground mt-1">Track all incoming inventory & supplier dues.</p>
          </div>
          <Link href="/purchases/new"><Button><Plus className="h-4 w-4" /> New Purchase (F9)</Button></Link>
        </div>
        <Card><CardContent className="pt-6">
          <Table>
            <THead><TR><TH>Voucher #</TH><TH>Date</TH><TH>Supplier</TH><TH>Total</TH></TR></THead>
            <TBody>
              {data.map((s:any)=>(
                <TR key={s.id}>
                  <TD className="font-medium">{s.voucherNo}</TD>
                  <TD>{new Date(s.date).toLocaleDateString()}</TD>
                  <TD>{s.supplier.name}</TD>
                  <TD className="tabular-nums">{inr(s.total)}</TD>
                </TR>
              ))}
              {data.length===0 && <TR><TD colSpan={4} className="text-center py-12 text-muted-foreground">No purchases yet.</TD></TR>}
            </TBody>
          </Table>
        </CardContent></Card>
      </div>
    </AppShell>
  );
}
