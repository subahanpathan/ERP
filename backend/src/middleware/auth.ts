import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export interface AuthReq extends Request { userId?: string; companyId?: string }
export function requireAuth(req: AuthReq, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const p = jwt.verify(h.slice(7), process.env.JWT_SECRET!) as any;
    req.userId = p.userId;
    req.companyId = (req.headers["x-company-id"] as string) || undefined;
    next();
  } catch { return res.status(401).json({ error: "Invalid token" }); }
}
export function requireCompany(req: AuthReq, res: Response, next: NextFunction) {
  if (!req.companyId) return res.status(400).json({ error: "X-Company-Id header required" });
  next();
}
