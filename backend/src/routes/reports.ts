import { Router } from "express";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { db } from "../db";
import { AuthReq, requireCompany } from "../middleware/auth";
export const reportRouter = Router();
reportRouter.use(requireCompany);

reportRouter.get("/stock-summary", async (req: AuthReq, res) => {
  const items = await db.item.findMany({ where: { companyId: req.companyId! }});
  res.json(items.map(i => ({
    name: i.name, sku: i.sku, unit: i.unit,
    currentStock: i.currentStock, value: i.currentStock * i.purchasePrice,
  })));
});

reportRouter.get("/sales", async (req: AuthReq, res) => {
  res.json(await db.salesVoucher.findMany({ where: { companyId: req.companyId! }, include: { customer: true }, orderBy: { date: "desc" }}));
});

reportRouter.get("/purchases", async (req: AuthReq, res) => {
  res.json(await db.purchaseVoucher.findMany({ where: { companyId: req.companyId! }, include: { supplier: true }, orderBy: { date: "desc" }}));
});

reportRouter.get("/sales/export.xlsx", async (req: AuthReq, res) => {
  const data = await db.salesVoucher.findMany({ where: { companyId: req.companyId! }, include: { customer: true }});
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Sales");
  ws.columns = [
    { header: "Voucher", key: "voucherNo", width: 22 },
    { header: "Date", key: "date", width: 14 },
    { header: "Customer", key: "customer", width: 30 },
    { header: "Subtotal", key: "subtotal", width: 14 },
    { header: "GST", key: "gstTotal", width: 14 },
    { header: "Total", key: "total", width: 14 },
  ];
  data.forEach(d => ws.addRow({ voucherNo: d.voucherNo, date: d.date.toISOString().slice(0,10), customer: d.customer.name, subtotal: d.subtotal, gstTotal: d.gstTotal, total: d.total }));
  res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition",'attachment; filename="sales.xlsx"');
  await wb.xlsx.write(res); res.end();
});

reportRouter.get("/stock-summary/export.pdf", async (req: AuthReq, res) => {
  const items = await db.item.findMany({ where: { companyId: req.companyId! }});
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  res.setHeader("Content-Type","application/pdf");
  res.setHeader("Content-Disposition",'inline; filename="stock.pdf"');
  doc.pipe(res);
  doc.fontSize(18).text("Stock Summary"); doc.moveDown();
  doc.fontSize(10);
  const top = doc.y;
  doc.text("Item", 50, top); doc.text("SKU", 250, top); doc.text("Stock", 350, top); doc.text("Value", 450, top);
  let y = top + 18;
  for (const i of items) {
    doc.text(i.name, 50, y); doc.text(i.sku, 250, y);
    doc.text(String(i.currentStock), 350, y); doc.text((i.currentStock * i.purchasePrice).toFixed(2), 450, y);
    y += 18;
  }
  doc.end();
});
