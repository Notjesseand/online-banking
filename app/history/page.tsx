"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import Spinner from "@/components/spinner";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";

// Transaction type
interface Transaction {
  recipientId: string;
  recipientName: string;
  amount: number;
  status: string;
  timestamp: Date | string;
  [key: string]: any;
}

export default function Page() {
  const loading = useAuthRedirect();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransfers, setTotalTransfers] = useState<number>(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "transferLogs"),
      where("senderId", "==", user.uid) // Fetch only this user's sent transfers
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => {
          const docData = doc.data() as Transaction; // Cast to Transaction type
          return {
            id: doc.id,
            ...docData,
            timestamp:
              // @ts-ignore
              docData.timestamp?.toDate?.() ?? new Date(docData.timestamp),
          } as Transaction;
        });

        const sorted = data.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        const total = sorted
          .filter((tx) => tx.status?.toLowerCase?.() === "completed")
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        setTransactions(sorted);
        setTotalTransfers(total);
      },
      (error: Error) => {
        console.error("Error fetching transfer history:", error);
      }
    );

    return () => unsubscribe();
  }, []);

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
        <div className="flex flex-col gap-4 p-4 md:p-6 font-montserrat">
          <h1 className="text-2xl font-semibold">Transfer History</h1>

          {/* Total Transfers Card */}
          <Card className="transform transition-transform scale-95 hover:scale-[98%] bg-gradient-to-t from-green-500/10 to-green-100/10 dark:from-green-700/10 dark:to-card border-2 border-green-300 dark:border-green-600 shadow-md hover:shadow-lg animate-in fade-in duration-500">
            <CardHeader className="flex flex-row items-center gap-3">
              <HiOutlineCurrencyDollar className="text-2xl text-green-600 dark:text-green-400" />
              <CardTitle className="text-lg font-semibold text-green-600 dark:text-green-300">
                Total Confirmed Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums">
                $
                {totalTransfers.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Sum of all confirmed transfers you sent
              </p>
            </CardContent>
          </Card>

          {/* Transaction List */}
          {transactions.length === 0 ? (
            <p className="text-muted-foreground">No transactions found.</p>
          ) : (
            transactions.map((tx, idx) => (
              <Card
                key={idx}
                className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 transition-all duration-200 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium capitalize">Transfer</p>
                    <p className="text-sm text-muted-foreground">
                      {tx.recipientName} (ID: {tx.recipientId})
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ${tx.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">{tx.status}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Africa/Lagos",
                    })}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
