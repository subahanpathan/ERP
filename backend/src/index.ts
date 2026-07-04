import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { companyRouter } from "./routes/companies";
import { customerRouter } from "./routes/customers";
import { supplierRouter } from "./routes/suppliers";
import { itemRouter } from "./routes/items";
import { purchaseRouter } from "./routes/purchases";
import { salesRouter } from "./routes/sales";
import { invoiceRouter } from "./routes/invoices";
import { reportRouter } from "./routes/reports";
import { dashboardRouter } from "./routes/dashboard";
import { requireAuth } from "./middleware/auth";

console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));

app.get("/health", (_, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/companies", requireAuth, companyRouter);
app.use("/api/customers", requireAuth, customerRouter);
app.use("/api/suppliers", requireAuth, supplierRouter);
app.use("/api/items", requireAuth, itemRouter);
app.use("/api/purchases", requireAuth, purchaseRouter);
app.use("/api/sales", requireAuth, salesRouter);
app.use("/api/invoices", requireAuth, invoiceRouter);
app.use("/api/reports", requireAuth, reportRouter);
app.use("/api/dashboard", requireAuth, dashboardRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Server error",
  });
});

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`SmartERP API on :${port}`);
});