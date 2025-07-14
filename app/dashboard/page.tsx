"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import Spinner from "@/components/spinner";
import { TransferHistory } from "@/components/transfer-history";
import { TransferForm } from "@/components/transferForm";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CiWallet } from "react-icons/ci";
import { HiOutlineWallet } from "react-icons/hi2";
import "@/styles/star-background.css";
import { ProfileCompleteness } from "@/components/dashboard/profile-completeness";

export default function Page() {
  const loading = useAuthRedirect();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    setUserId(user.uid); // ✅ set userId for history component

    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (docSnap) => {
        const data = docSnap.data();
        if (data?.walletBalance !== undefined) {
          setWalletBalance(data.walletBalance);
        } else {
          setWalletBalance(0);
        }
      },
      (error) => {
        console.error("Error fetching wallet balance:", error);
        setWalletBalance(0);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative p-0 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="z-10 absolute inset-0 pointer-events-none">
        <div className="stars small" />
        <div className="stars medium" />
        <div className="stars large" />
      </div>

      <SidebarProvider>
        <AppSidebar
          variant="inset"
          className="bg-gray-900/80 backdrop-blur-md"
        />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col p-4 md:p-6 text-white font-montserrat relative z-50 ">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-[13px]">
              {/* Wallet Balance */}
              <Card className="bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4 p-6">
                  <CiWallet className="text-3xl text-blue-400" />
                  <CardTitle className="text-xl font-bold text-white font-montserrat">
                    Wallet Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-3xl font-extrabold tabular-nums font-montserrat text-green-400">
                    $
                    {walletBalance !== null
                      ? walletBalance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"}
                  </p>
                  <p className="text-sm lg:text-xs  font-medium text-gray-400 mt-2">
                    Available for transfers
                  </p>
                </CardContent>
              </Card>

              {/* Transfer Form */}
              <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 lg:col-span-2">
                <h2 className="text-2xl font-bold text-white p-6 border-b border-gray-700">
                  Send Money
                </h2>
                <div className="p-2 sm:p-6">
                  <TransferForm />
                </div>
              </div>
              <div className="col-span-3">
                <ProfileCompleteness userId={userId as string} isAdminView />
              </div>

              {/* Transfer History */}
              <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 col-span-3">
                <h2 className="text-2xl font-bold text-white p-6 border-b border-gray-700">
                  Transfer History
                </h2>
                <div className="p-2 sm:p-6">
                  <TransferHistory filterByUserId={userId as string} />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
