// app/transfer/page.tsx
"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TransferForm } from "@/components/transferForm";
import Spinner from "@/components/spinner";
import { TransferHistory } from "@/components/transfer-history";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";

export default function TransferPage() {
  const loading = useAuthRedirect();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    setUserId(user.uid); // ✅ set userId for history component
  });

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
          <TransferHistory filterByUserId={userId as string} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
