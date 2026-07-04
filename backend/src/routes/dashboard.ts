import { Router } from "express";
import { db } from "../db";
import { AuthReq, requireCompany } from "../middleware/auth";
export const dashboardRouter = Router();
dashboardRouter.use(requireCompany);

dashboardRouter.get("/", async (req: AuthReq, res) => {
  const cid = req.companyId!;
  const [salesAgg, purchaseAgg, customers, suppliers, items, recentSales, recentPurchases] = await Promise.all([
    db.salesVoucher.aggregate({ where: { companyId: cid }, _sum: { total: true }}),
    db.purchaseVoucher.aggregate({ where: { companyId: cid }, _sum: { total: true }}),
    db.customer.count({ where: { companyId: cid }}),
    db.supplier.count({ where: { companyId: cid }}),
    db.item.findMany({ where: { companyId: cid }}),
    db.salesVoucher.findMany({ where: { companyId: cid }, include: { customer: true }, orderBy: { date: "desc" }, take: 5 }),
    db.purchaseVoucher.findMany({ where: { companyId: cid }, include: { supplier: true }, orderBy: { date: "desc" }, take: 5 }),
  ]);
  const inventoryValue = items.reduce((a,b)=>a + b.currentStock * b.purchasePrice, 0);
  const receivables = (await db.customer.aggregate({ where: { companyId: cid }, _sum: { outstanding: true }}))._sum.outstanding || 0;
  const payables = (await db.supplier.aggregate({ where: { companyId: cid }, _sum: { outstanding: true }}))._sum.outstanding || 0;
  // monthly series (last 6 months)
  const months: { label: string; sales: number; purchases: number }[] = [];
  const now = new Date();
  for (let k=5;k>=0;k--){
    const d = new Date(now.getFullYear(), now.getMonth()-k, 1);
    const next = new Date(now.getFullYear(), now.getMonth()-k+1, 1);
    const s = await db.salesVoucher.aggregate({ where: { companyId: cid, date: { gte: d, lt: next }}, _sum: { total: true }});
    const p = await db.purchaseVoucher.aggregate({ where: { companyId: cid, date: { gte: d, lt: next }}, _sum: { total: true }});
    months.push({ label: d.toLocaleString("en", { month: "short" }), sales: s._sum.total || 0, purchases: p._sum.total || 0 });
  }
  res.json({
    totals: {
      sales: salesAgg._sum.total || 0,
      purchases: purchaseAgg._sum.total || 0,
      customers, suppliers,
      inventoryValue, receivables, payables,
    },
    months, recentSales, recentPurchases,
  });
});
