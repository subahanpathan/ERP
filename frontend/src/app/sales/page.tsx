"use client";
import { AppShell } from "@/components/layout/shell";
import { useEffect, useState } from "react";
import { api, apiUrl, getToken, getCompanyId } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { inr } from "@/lib/utils";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => { api("/api/sales").then(setData).catch(()=>{}); }, []);
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Sales Vouchers</h1>
            <p className="text-muted-foreground mt-1">Every sale auto-creates an invoice and updates stock.</p>
          </div>
          <Link href="/sales/new"><Button><Plus className="h-4 w-4" /> New Sale (F8)</Button></Link>
        </div>
        <Card><CardContent className="pt-6">
          <Table>
            <THead><TR><TH>Voucher #</TH><TH>Date</TH><TH>Customer</TH><TH>Total</TH><TH></TH></TR></THead>
            <TBody>
              {data.map((s:any)=>(
                <TR key={s.id}>
                  <TD className="font-medium">{s.voucherNo}</TD>
                  <TD>{new Date(s.date).toLocaleDateString()}</TD>
                  <TD>{s.customer.name}</TD>
                  <TD className="tabular-nums">{inr(s.total)}</TD>
                  <TD className="text-right">
                    {s.invoice && (
                      <a href={`${apiUrl(`/api/invoices/${s.invoice.id}/pdf`)}?t=${getToken()}&c=${getCompanyId()}`}
                         target="_blank" rel="noopener" onClick={(e)=>{ e.preventDefault(); window.open(apiUrl(`/api/invoices/${s.invoice.id}/pdf`),"_blank"); }}
                         className="text-primary text-sm inline-flex items-center gap-1"><FileText className="h-4 w-4"/>Invoice</a>
                    )}
                  </TD>
                </TR>
              ))}
              {data.length===0 && <TR><TD colSpan={5} className="text-center py-12 text-muted-foreground">No sales yet.</TD></TR>}
            </TBody>
          </Table>
        </CardContent></Card>
      </div>
    </AppShell>
  );
}
