import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { AuthReq, requireCompany } from "../middleware/auth";
export const purchaseRouter = Router();
purchaseRouter.use(requireCompany);

const lineSchema = z.object({ itemId: z.string(), quantity: z.number().positive(), rate: z.number().nonnegative(), gst: z.number().nonnegative() });
const schema = z.object({ supplierId: z.string(), date: z.string().optional(), notes: z.string().optional(), items: z.array(lineSchema).min(1) });

purchaseRouter.get("/", async (req: AuthReq, res) => {
  res.json(await db.purchaseVoucher.findMany({
    where: { companyId: req.companyId! },
    include: { supplier: true, items: { include: { item: true }}}, orderBy: { date: "desc" },
  }));
});

purchaseRouter.post("/", async (req: AuthReq, res, next) => {
  try {
    const data = schema.parse(req.body);
    const voucherNo = "PV-" + Date.now();
    const result = await db.$transaction(async (tx) => {
      let subtotal = 0, gstTotal = 0;
      const items = data.items.map(i => {
        const base = i.quantity * i.rate;
        const gst = base * (i.gst/100);
        subtotal += base; gstTotal += gst;
        return { ...i, amount: base + gst };
      });
      const total = subtotal + gstTotal;
      const v = await tx.purchaseVoucher.create({
        data: {
          companyId: req.companyId!, supplierId: data.supplierId, voucherNo,
          date: data.date ? new Date(data.date) : new Date(),
          notes: data.notes, subtotal, gstTotal, total,
          items: { create: items },
        },
      });
      for (const i of items) {
        await tx.item.update({ where: { id: i.itemId }, data: { currentStock: { increment: i.quantity }}});
        await tx.inventoryTransaction.create({ data: { companyId: req.companyId!, itemId: i.itemId, type: "IN", quantity: i.quantity, reference: voucherNo }});
      }
      await tx.supplier.update({ where: { id: data.supplierId }, data: { outstanding: { increment: total }}});
      return v;
    });
    res.json(result);
  } catch (e) { next(e); }
});
