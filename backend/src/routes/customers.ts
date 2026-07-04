import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { AuthReq, requireCompany } from "../middleware/auth";
export const customerRouter = Router();
customerRouter.use(requireCompany);
const s = z.object({
  name: z.string().min(1), mobile: z.string().optional(), email: z.string().optional(),
  address: z.string().optional(), gstNumber: z.string().optional(),
  openingBalance: z.number().default(0),
});
customerRouter.get("/", async (req: AuthReq, res) => {
  const q = (req.query.q as string) || "";
  res.json(await db.customer.findMany({
    where: { companyId: req.companyId!, name: { contains: q, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  }));
});
customerRouter.get("/:id/ledger", async (req: AuthReq, res) => {
  const c = await db.customer.findUnique({ where: { id: req.params.id } });
  const sales = await db.salesVoucher.findMany({ where: { customerId: req.params.id }, orderBy: { date: "desc" }});
  res.json({ customer: c, sales });
});
customerRouter.post("/", async (req: AuthReq, res, next) => {
  try { res.json(await db.customer.create({ data: { ...s.parse(req.body), companyId: req.companyId!, outstanding: req.body.openingBalance || 0 } })); }
  catch(e){next(e);}
});
customerRouter.put("/:id", async (req, res, next) => {
  try { res.json(await db.customer.update({ where: { id: req.params.id }, data: s.parse(req.body) })); }
  catch(e){next(e);}
});
customerRouter.delete("/:id", async (req, res) => { await db.customer.delete({ where: { id: req.params.id }}); res.json({ ok: true }); });
