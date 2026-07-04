"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuth();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      const r = await api<{ token: string; user: any }>("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
      setAuth(r.token, r.user);
      toast.success("Account created");
      router.push("/companies");
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  }
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5">
        <h2 className="text-2xl font-semibold">Create account</h2>
        <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={e=>setName(e.target.value)} required /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} /></div>
        <Button className="w-full" disabled={loading}>{loading ? "Creating…" : "Create account"}</Button>
        <p className="text-sm text-center text-muted-foreground">Already have one? <Link href="/login" className="text-primary hover:underline">Sign in</Link></p>
      </form>
    </div>
  );
}
