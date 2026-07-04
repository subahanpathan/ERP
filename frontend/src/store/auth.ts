"use client";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: { id: string; email: string; name: string } | null;
  companyId: string | null;
  setAuth: (token: string, user: any) => void;
  setCompany: (id: string) => void;
  logout: () => void;
  hydrate: () => void;
}
export const useAuth = create<AuthState>((set) => ({
  token: null, user: null, companyId: null,
  setAuth: (token, user) => { localStorage.setItem("token", token); localStorage.setItem("user", JSON.stringify(user)); set({ token, user }); },
  setCompany: (id) => { localStorage.setItem("companyId", id); set({ companyId: id }); },
  logout: () => { localStorage.clear(); set({ token: null, user: null, companyId: null }); },
  hydrate: () => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    const c = localStorage.getItem("companyId");
    set({ token: t, user: u ? JSON.parse(u) : null, companyId: c });
  },
}));
