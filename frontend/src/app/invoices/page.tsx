"use client";
import { AppShell } from "@/components/layout/shell";
import { useEffect, useState } from "react";
import { api, apiUrl } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { FileText } from "lucide-react";
import { inr } from "@/lib/utils";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => { api("/api/invoices").then(setData).catch(()=>{}); }, []);
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1">Generated from every sales voucher. Download PDFs.</p>
        </div>
        <Card><CardContent className="pt-6">
          <Table>
            <THead><TR><TH>Invoice #</TH><TH>Date</TH><TH>Customer</TH><TH>Type</TH><TH>Total</TH><TH></TH></TR></THead>
            <TBody>
              {data.map((inv:any)=>(
                <TR key={inv.id}>
                  <TD className="font-medium">{inv.invoiceNo}</TD>
                  <TD>{new Date(inv.createdAt).toLocaleDateString()}</TD>
                  <TD>{inv.sales.customer.name}</TD>
                  <TD>{inv.type}</TD>
                  <TD className="tabular-nums">{inr(inv.sales.total)}</TD>
                  <TD className="text-right">
                    <button onClick={()=>window.open(apiUrl(`/api/invoices/${inv.id}/pdf`),"_blank")} className="text-primary text-sm inline-flex items-center gap-1"><FileText className="h-4 w-4"/>Open PDF</button>
                  </TD>
                </TR>
              ))}
              {data.length===0 && <TR><TD colSpan={6} className="text-center py-12 text-muted-foreground">No invoices yet.</TD></TR>}
            </TBody>
          </Table>
        </CardContent></Card>
      </div>
    </AppShell>
  );
}
