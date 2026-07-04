"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Truck, Package, FileDown, FileUp, Receipt, BarChart3, Building2, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/suppliers", label: "Suppliers", icon: Truck },
  { href: "/items", label: "Items", icon: Package },
  { href: "/purchases", label: "Purchases", icon: FileDown },
  { href: "/sales", label: "Sales", icon: FileUp },
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <motion.aside animate={{ width: collapsed ? 72 : 240 }} transition={{ duration: 0.2 }}
      className="sticky top-0 h-screen border-r bg-card/30 backdrop-blur-xl flex flex-col">
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-400 grid place-items-center text-primary-foreground font-bold">S</div>
          {!collapsed && <span className="font-semibold tracking-tight">SmartERP</span>}
        </div>
        <button onClick={()=>setCollapsed(!collapsed)} className="opacity-60 hover:opacity-100 transition-opacity">
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {nav.map(n => {
          const active = pathname === n.href || pathname.startsWith(n.href + "/");
          return (
            <Link key={n.href} href={n.href}
              className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group",
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
              <n.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{n.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 text-[10px] text-muted-foreground border-t">
        {!collapsed && <>v1.0 · MVP · © SmartERP</>}
      </div>
    </motion.aside>
  );
}
