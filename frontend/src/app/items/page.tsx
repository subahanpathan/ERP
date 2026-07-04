"use client";
import { AppShell } from "@/components/layout/shell";
import { ResourcePage } from "@/components/layout/resource-page";
import { inr } from "@/lib/utils";
export default function Page() {
  return (
    <AppShell>
      <ResourcePage
        title="Items" description="Your product catalog and live stock levels."
        endpoint="/api/items"
        fields={[
          { key: "name", label: "Item Name" }, { key: "sku", label: "SKU" },
          { key: "hsnCode", label: "HSN Code" }, { key: "unit", label: "Unit", placeholder: "PCS / KG / MTR" },
          { key: "purchasePrice", label: "Purchase Price", type: "number" },
          { key: "sellingPrice", label: "Selling Price", type: "number" },
          { key: "gstPercentage", label: "GST %", type: "number" },
          { key: "openingQuantity", label: "Opening Qty", type: "number" },
        ]}
        columns={[
          { key: "name", label: "Item" }, { key: "sku", label: "SKU" },
          { key: "unit", label: "Unit" },
          { key: "sellingPrice", label: "Price", render: (r:any) => inr(r.sellingPrice) },
          { key: "currentStock", label: "Stock" },
        ]}
      />
    </AppShell>
  );
}
