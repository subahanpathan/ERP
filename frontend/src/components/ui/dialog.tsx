"use client";
import * as React from "react";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;
export function DialogContent({ className, children, ...p }: React.ComponentPropsWithoutRef<typeof D.Content>) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <D.Content className={cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-card p-6 shadow-2xl rounded-2xl data-[state=open]:animate-in data-[state=open]:zoom-in-95", className)} {...p}>
        {children}
        <D.Close className="absolute right-4 top-4 rounded-md opacity-70 hover:opacity-100"><X className="h-4 w-4" /></D.Close>
      </D.Content>
    </D.Portal>
  );
}
export function DialogHeader({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex flex-col space-y-1.5", className)} {...p} />; }
export function DialogTitle({ className, ...p }: React.ComponentPropsWithoutRef<typeof D.Title>) { return <D.Title className={cn("text-lg font-semibold", className)} {...p} />; }
export function DialogDescription({ className, ...p }: React.ComponentPropsWithoutRef<typeof D.Description>) { return <D.Description className={cn("text-sm text-muted-foreground", className)} {...p} />; }
