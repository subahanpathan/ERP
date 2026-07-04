"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api";
import { inr } from "@/lib/utils";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ArrowUpRight, TrendingUp, Users, Truck, Package, IndianRupee, Wallet, ArrowDownRight } from "lucide-react";

const kpis = (t: any) => [
  { label: "Total Sales", value: inr(t.sales), icon: TrendingUp, accent: "from-emerald-500/20 to-emerald-500/5" },
  { label: "Total Purchases", value: inr(t.purchases), icon: ArrowDownRight, accent: "from-blue-500/20 to-blue-500/5" },
  { label: "Inventory Value", value: inr(t.inventoryValue), icon: Package, accent: "from-violet-500/20 to-violet-500/5" },
  { label: "Receivables", value: inr(t.receivables), icon: IndianRupee, accent: "from-amber-500/20 to-amber-500/5" },
  { label: "Payables", value: inr(t.payables), icon: Wallet, accent: "from-rose-500/20 to-rose-500/5" },
  { label: "Customers", value: t.customers, icon: Users, accent: "from-cyan-500/20 to-cyan-500/5" },
  { label: "Suppliers", value: t.suppliers, icon: Truck, accent: "from-fuchsia-500/20 to-fuchsia-500/5" },
];

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string>("");
  useEffect(() => { api("/api/dashboard").then(setData).catch(e=>setErr(e.message)); }, []);
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
            <p className="text-muted-foreground mt-1">Real-time business pulse across sales, purchases & inventory.</p>
          </div>
        </div>

        {err && <Card><CardContent className="py-6 text-sm text-muted-foreground">Select a company from the top bar to view your dashboard.</CardContent></Card>}

        {data && (
          <>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {kpis(data.totals).map((k, i) => (
                <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.04 }}>
                  <Card className="overflow-hidden relative group hover:shadow-lg transition-shadow">
                    <div className={`absolute inset-0 bg-gradient-to-br ${k.accent} opacity-50 group-hover:opacity-80 transition-opacity`} />
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between">
                        <CardDescription className="text-xs uppercase tracking-wider">{k.label}</CardDescription>
                        <k.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-2xl mt-2">{k.value}</CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sales — last 6 months</CardTitle>
                  <CardDescription>Trailing performance trend</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.months}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                      <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Purchases — last 6 months</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.months}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                      <Bar dataKey="purchases" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Recent Sales</CardTitle></CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {data.recentSales.map((s: any) => (
                      <li key={s.id} className="py-3 flex justify-between items-center text-sm">
                        <div>
                          <div className="font-medium">{s.customer.name}</div>
                          <div className="text-xs text-muted-foreground">{s.voucherNo} · {new Date(s.date).toLocaleDateString()}</div>
                        </div>
                        <span className="font-semibold">{inr(s.total)}</span>
                      </li>
                    ))}
                    {data.recentSales.length === 0 && <li className="py-4 text-sm text-muted-foreground">No sales yet.</li>}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Recent Purchases</CardTitle></CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {data.recentPurchases.map((p: any) => (
                      <li key={p.id} className="py-3 flex justify-between items-center text-sm">
                        <div>
                          <div className="font-medium">{p.supplier.name}</div>
                          <div className="text-xs text-muted-foreground">{p.voucherNo} · {new Date(p.date).toLocaleDateString()}</div>
                        </div>
                        <span className="font-semibold">{inr(p.total)}</span>
                      </li>
                    ))}
                    {data.recentPurchases.length === 0 && <li className="py-4 text-sm text-muted-foreground">No purchases yet.</li>}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
