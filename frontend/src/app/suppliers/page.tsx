"use client";
import { AppShell } from "@/components/layout/shell";
import { ResourcePage } from "@/components/layout/resource-page";
import { inr } from "@/lib/utils";
export default function Page() {
  return (
    <AppShell>
      <ResourcePage
        title="Suppliers" description="Vendors you purchase from."
        endpoint="/api/suppliers"
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
