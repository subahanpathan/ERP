"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@smarterp.io");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuth();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      const r = await api<{ token: string; user: any }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setAuth(r.token, r.user);
      toast.success("Welcome back, " + r.user.name);
      router.push("/dashboard");
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/20 via-background to-background border-r relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, hsl(var(--primary)) 0%, transparent 40%)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-12">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 grid place-items-center text-primary-foreground font-bold text-lg">S</div>
            <span className="font-semibold text-lg">SmartERP</span>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-semibold tracking-tight max-w-md leading-tight">
            The business operating system for modern Indian SMBs.
          </motion.h1>
          <p className="mt-6 text-muted-foreground max-w-md">Inventory, billing, GST invoices, ledgers and reports — designed with the polish of Linear and the power of Tally.</p>
        </div>
        <div className="relative text-xs text-muted-foreground">© SmartERP 2026</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">Use the demo credentials or create an account.</p>
          </div>
          <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></div>
          <div className="space-y-2"><Label>Password</Label><Input value={password} onChange={e=>setPassword(e.target.value)} type="password" required /></div>
          <Button className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
          <p className="text-sm text-center text-muted-foreground">No account? <Link href="/register" className="text-primary hover:underline">Register</Link></p>
        </motion.form>
      </div>
    </div>
  );
}
