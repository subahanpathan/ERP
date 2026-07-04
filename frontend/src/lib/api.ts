const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export function getToken() { return typeof window === "undefined" ? null : localStorage.getItem("token"); }
export function getCompanyId() { return typeof window === "undefined" ? null : localStorage.getItem("companyId"); }
export async function api<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string,string> = { "Content-Type": "application/json", ...(opts.headers as any) };
  const t = getToken(); if (t) headers["Authorization"] = "Bearer " + t;
  const c = getCompanyId(); if (c) headers["X-Company-Id"] = c;
  const res = await fetch(BASE + path, { ...opts, headers });
  if (!res.ok) { const e = await res.json().catch(()=>({error:res.statusText})); throw new Error(e.error || "Request failed"); }
  if (res.headers.get("Content-Type")?.includes("application/json")) return res.json();
  return res as any;
}
export const apiUrl = (p: string) => BASE + p;
