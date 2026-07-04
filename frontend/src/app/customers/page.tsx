"use client";
import { AppShell } from "@/components/layout/shell";
import { ResourcePage } from "@/components/layout/resource-page";
import { inr } from "@/lib/utils";
export default function Page() {
  return (
    <AppShell>
      <ResourcePage
        title="Customers" description="Buyers and the businesses you bill."
        endpoint="/api/customers"
        fields={[
          { key: "name", label: "Name" }, { key: "mobile", label: "Mobile" },
          { key: "email", label: "Email" }, { key: "gstNumber", label: "GST Number" },
          { key: "address", label: "Address" },
          { key: "openingBalance", label: "Opening Balance", type: "number" },
        ]}
        columns={[
          { key: "name", label: "Name" }, { key: "mobile", label: "Mobile" },
          { key: "gstNumber", label: "GST" },
          { key: "outstanding", label: "Outstanding", render: (r: any) => inr(r.outstanding) },
        ]}
      />
    </AppShell>
  );
}
