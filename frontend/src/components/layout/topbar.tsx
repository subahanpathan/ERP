"use client";
import { useEffect, useState } from "react";
import { Search, Sun, Moon, LogOut, Building2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { CommandPalette } from "./command-palette";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { user, companyId, setCompany, logout } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [palette, setPalette] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api("/api/companies").then(setCompanies).catch(()=>{});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette(true); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "h") { e.preventDefault(); router.push("/dashboard"); }
      if (e.key === "F8") { e.preventDefault(); router.push("/sales/new"); }
      if (e.key === "F9") { e.preventDefault(); router.push("/purchases/new"); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") { e.preventDefault(); router.push("/sales/new"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-6 border-b bg-background/70 backdrop-blur-xl">
        <button onClick={() => setPalette(true)} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/60 hover:bg-muted px-3 py-1.5 rounded-lg w-80 transition-colors">
          <Search className="h-4 w-4" />
          <span>Search or jump to…</span>
          <kbd className="ml-auto text-[10px] bg-background border px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <select value={companyId || ""} onChange={e=>setCompany(e.target.value)} className="bg-transparent outline-none text-sm">
              <option value="">Select company…</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <div className="text-sm hidden md:block">
            <div className="font-medium">{user?.name}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => { logout(); router.push("/login"); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <CommandPalette open={palette} setOpen={setPalette} />
    </>
  );
}
