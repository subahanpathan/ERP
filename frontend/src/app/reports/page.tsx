"use client";
import { AppShell } from "@/components/layout/shell";
import { useEffect, useState } from "react";
import { api, apiUrl } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { inr } from "@/lib/utils";
import { FileDown, Sheet } from "lucide-react";

export default function Page() {
  const [stock, setStock] = useState<any[]>([]);
  useEffect(() => { api("/api/reports/stock-summary").then(setStock).catch(()=>{}); }, []);
  const totalValue = stock.reduce((a,b)=>a+b.value,0);
  const lowStock = stock.filter(s => s.currentStock < 10);
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">Stock, sales & purchase reports — exportable to PDF & Excel.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardHeader><CardDescription>Inventory Value</CardDescription><CardTitle className="text-2xl">{inr(totalValue)}</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Items Tracked</CardDescription><CardTitle className="text-2xl">{stock.length}</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Low Stock (&lt; 10)</CardDescription><CardTitle className="text-2xl">{lowStock.length}</CardTitle></CardHeader></Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div><CardTitle>Stock Summary</CardTitle><CardDescription>Closing stock = Opening + Purchases − Sales</CardDescription></div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={()=>window.open(apiUrl("/api/reports/stock-summary/export.pdf"),"_blank")}><FileDown className="h-4 w-4"/>PDF</Button>
              <Button variant="outline" onClick={()=>window.open(apiUrl("/api/reports/sales/export.xlsx"),"_blank")}><Sheet className="h-4 w-4"/>Sales Excel</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <THead><TR><TH>Item</TH><TH>SKU</TH><TH>Unit</TH><TH>Stock</TH><TH>Value</TH></TR></THead>
              <TBody>
                {stock.map((s, i) => (
                  <TR key={i}>
                    <TD className="font-medium">{s.name}</TD>
                    <TD>{s.sku}</TD>
                    <TD>{s.unit}</TD>
                    <TD className={s.currentStock < 10 ? "text-amber-500 font-medium" : ""}>{s.currentStock}</TD>
                    <TD className="tabular-nums">{inr(s.value)}</TD>
                  </TR>
                ))}
                {stock.length===0 && <TR><TD colSpan={5} className="text-center py-12 text-muted-foreground">No stock yet.</TD></TR>}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
