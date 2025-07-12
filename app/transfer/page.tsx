// app/transfer/page.tsx
"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TransferForm } from "@/components/transferForm";
import Spinner from "@/components/spinner";
import { TransferHistory } from "@/components/transfer-history";

export default function TransferPage() {
  const loading = useAuthRedirect();

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 font-montserrat space-y-6">
          <h1 className="text-2xl font-bold mb-4">Make a Transfer</h1>
          <TransferForm />
          <TransferHistory />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
