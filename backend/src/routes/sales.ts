import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { AuthReq, requireCompany } from "../middleware/auth";
export const salesRouter = Router();
salesRouter.use(requireCompany);

const lineSchema = z.object({ itemId: z.string(), quantity: z.number().positive(), rate: z.number().nonnegative(), gst: z.number().nonnegative() });
const schema = z.object({ customerId: z.string(), date: z.string().optional(), notes: z.string().optional(), items: z.array(lineSchema).min(1) });

salesRouter.get("/", async (req: AuthReq, res) => {
  res.json(await db.salesVoucher.findMany({
    where: { companyId: req.companyId! },
    include: { customer: true, items: { include: { item: true }}, invoice: true },
    orderBy: { date: "desc" },
  }));
});

salesRouter.post("/", async (req: AuthReq, res, next) => {
  try {
    const data = schema.parse(req.body);
    const voucherNo = "SV-" + Date.now();
    const result = await db.$transaction(async (tx) => {
      let subtotal = 0, gstTotal = 0;
      const items = data.items.map(i => {
        const base = i.quantity * i.rate;
        const gst = base * (i.gst/100);
        subtotal += base; gstTotal += gst;
        return { ...i, amount: base + gst };
      });
      const total = subtotal + gstTotal;
      const v = await tx.salesVoucher.create({
        data: {
          companyId: req.companyId!, customerId: data.customerId, voucherNo,
          date: data.date ? new Date(data.date) : new Date(),
          notes: data.notes, subtotal, gstTotal, total,
          items: { create: items },
        },
      });
      for (const i of items) {
        await tx.item.update({ where: { id: i.itemId }, data: { currentStock: { decrement: i.quantity }}});
        await tx.inventoryTransaction.create({ data: { companyId: req.companyId!, itemId: i.itemId, type: "OUT", quantity: i.quantity, reference: voucherNo }});
      }
      await tx.customer.update({ where: { id: data.customerId }, data: { outstanding: { increment: total }}});
      const invNo = "INV-" + Date.now();
      await tx.invoice.create({ data: { companyId: req.companyId!, salesId: v.id, invoiceNo: invNo, type: "GST" }});
      return v;
    });
    res.json(result);
  } catch (e) { next(e); }
});
