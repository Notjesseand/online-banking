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
          <div className="flex flex-1 flex-col p-2 sm:p-4 md:p-6 text-white font-montserrat relative z-50">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Wallet Balance */}
              <Card className="bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 pb-6 md:pb-0 px-2">
                <CardHeader className="flex flex-row items-center  gap-2 sm:gap-4 p-3 sm:p-4">
                  <CiWallet className="text-xl sm:text-2xl md:text-3xl text-blue-400 mt-1" />
                  <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-white font-montserrat">
                    Wallet Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold font-mono tabular-nums text-green-400">
                    $
                    {walletBalance !== null
                      ? walletBalance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"}
                  </p>
                </CardContent>
              </Card>

              {/* Transfer Form */}
              <Card className="bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 col-span-1 md:col-span-2 lg:col-span-2">
                <CardHeader className="p-3 sm:p-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white border-b border-gray-700 pb-2">
                    Send Money
                  </h2>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <TransferForm />
                </CardContent>
              </Card>

              {/* Profile Completeness */}
              <Card className="bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 col-span-1 md:col-span-1 lg:col-span-3">
                <CardContent className="p-2 sm:p-4">
                  <ProfileCompleteness
                    userId={userId as string}
                    isAdminView={false}
                  />
                </CardContent>
              </Card>

              {/* Transfer History */}
              <Card className="bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader className="p-3 sm:p-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white border-b border-gray-700 pb-2">
                    Transfer History
                  </h2>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <TransferHistory filterByUserId={userId as string} />
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
