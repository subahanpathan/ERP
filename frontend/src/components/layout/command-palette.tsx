"use client";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const actions = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "New Sales Voucher (F8)", path: "/sales/new" },
  { label: "New Purchase Voucher (F9)", path: "/purchases/new" },
  { label: "Customers", path: "/customers" },
  { label: "Suppliers", path: "/suppliers" },
  { label: "Items", path: "/items" },
  { label: "Invoices", path: "/invoices" },
  { label: "Reports", path: "/reports" },
  { label: "Companies", path: "/companies" },
];

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (b:boolean)=>void }) {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-xl">
        <Command className="rounded-xl">
          <Command.Input placeholder="Type a command or search…" className="w-full px-4 py-3 bg-transparent outline-none border-b text-sm" />
          <Command.List className="p-2 max-h-80 overflow-auto">
            <Command.Empty className="p-4 text-sm text-muted-foreground">No results.</Command.Empty>
            <Command.Group heading="Navigate" className="text-xs text-muted-foreground px-2 py-1">
              {actions.map(a => (
                <Command.Item key={a.path} onSelect={() => { setOpen(false); router.push(a.path); }}
                  className="px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted">
                  {a.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
