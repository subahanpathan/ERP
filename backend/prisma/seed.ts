import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();
async function main() {
  const pw = await bcrypt.hash("demo1234", 10);
  const user = await db.user.upsert({
    where: { email: "demo@smarterp.io" },
    update: {},
    create: { email: "demo@smarterp.io", password: pw, name: "Demo User" },
  });
  const co = await db.company.create({
    data: {
      userId: user.id, name: "Acme Traders Pvt Ltd",
      gstNumber: "29ABCDE1234F1Z5", state: "Karnataka",
      address: "MG Road, Bengaluru", phone: "+91 98765 43210",
      email: "hello@acme.in", financialYear: "2025-2026",
    },
  });
  await db.customer.createMany({ data: [
    { companyId: co.id, name: "Globex Corp", mobile: "9999911111", gstNumber: "27AAACG1234A1Z5", openingBalance: 25000 },
    { companyId: co.id, name: "Initech Ltd", mobile: "9999922222", openingBalance: 10000 },
  ]});
  await db.supplier.createMany({ data: [
    { companyId: co.id, name: "Stark Industries", mobile: "8888811111", openingBalance: 50000 },
    { companyId: co.id, name: "Wayne Enterprises", mobile: "8888822222" },
  ]});
  await db.item.createMany({ data: [
    { companyId: co.id, name: "Steel Pipe 1\"", sku: "SP-001", hsnCode: "7306", unit: "MTR", purchasePrice: 120, sellingPrice: 180, openingQuantity: 100, currentStock: 100 },
    { companyId: co.id, name: "Copper Wire 2.5sqmm", sku: "CW-025", hsnCode: "8544", unit: "MTR", purchasePrice: 45, sellingPrice: 65, openingQuantity: 500, currentStock: 500 },
    { companyId: co.id, name: "LED Bulb 9W", sku: "LED-09", hsnCode: "8539", unit: "PCS", purchasePrice: 70, sellingPrice: 120, openingQuantity: 200, currentStock: 200 },
  ]});
  console.log("Seeded. Login: demo@smarterp.io / demo1234");
}
main().finally(()=>db.$disconnect());
