import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { AuthReq, requireCompany } from "../middleware/auth";
export const itemRouter = Router();
itemRouter.use(requireCompany);
const s = z.object({
  name: z.string().min(1), sku: z.string().min(1), hsnCode: z.string().optional(),
  unit: z.string().default("PCS"), purchasePrice: z.number(), sellingPrice: z.number(),
  gstPercentage: z.number().default(18), openingQuantity: z.number().default(0),
});
itemRouter.get("/", async (req: AuthReq, res) => {
  const q = (req.query.q as string) || "";
  res.json(await db.item.findMany({
    where: { companyId: req.companyId!, OR: [{ name:{ contains:q, mode:"insensitive"}},{ sku:{ contains:q, mode:"insensitive"}}]},
    orderBy: { createdAt: "desc" },
  }));
});
itemRouter.post("/", async (req: AuthReq, res, next) => {
  try { const d = s.parse(req.body); res.json(await db.item.create({ data: { ...d, companyId: req.companyId!, currentStock: d.openingQuantity }})); }
  catch(e){next(e);}
});
itemRouter.put("/:id", async (req, res, next) => {
  try { res.json(await db.item.update({ where: { id: req.params.id }, data: s.partial().parse(req.body) })); }
  catch(e){next(e);}
});
itemRouter.delete("/:id", async (req, res) => { await db.item.delete({ where: { id: req.params.id }}); res.json({ ok: true }); });
