import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { AuthReq, requireCompany } from "../middleware/auth";
export const supplierRouter = Router();
supplierRouter.use(requireCompany);
const s = z.object({
  name: z.string().min(1), mobile: z.string().optional(), email: z.string().optional(),
  address: z.string().optional(), gstNumber: z.string().optional(),
  openingBalance: z.number().default(0),
});
supplierRouter.get("/", async (req: AuthReq, res) => {
  const q = (req.query.q as string) || "";
  res.json(await db.supplier.findMany({
    where: { companyId: req.companyId!, name: { contains: q, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  }));
});
supplierRouter.get("/:id/ledger", async (req, res) => {
  const c = await db.supplier.findUnique({ where: { id: req.params.id } });
  const p = await db.purchaseVoucher.findMany({ where: { supplierId: req.params.id }, orderBy: { date: "desc" }});
  res.json({ supplier: c, purchases: p });
});
supplierRouter.post("/", async (req: AuthReq, res, next) => {
  try { res.json(await db.supplier.create({ data: { ...s.parse(req.body), companyId: req.companyId!, outstanding: req.body.openingBalance || 0 } })); }
  catch(e){next(e);}
});
supplierRouter.put("/:id", async (req, res, next) => {
  try { res.json(await db.supplier.update({ where: { id: req.params.id }, data: s.parse(req.body) })); }
  catch(e){next(e);}
});
supplierRouter.delete("/:id", async (req, res) => { await db.supplier.delete({ where: { id: req.params.id }}); res.json({ ok: true }); });
