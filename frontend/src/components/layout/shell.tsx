"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { motion } from "framer-motion";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { token, hydrate } = useAuth();
  const router = useRouter();
  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) router.push("/login");
  }, [router]);
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex-1 p-6 md:p-8">
          {children}
        </motion.main>
      </div>
    </div>
  );
}
