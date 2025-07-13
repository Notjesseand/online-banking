"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import Spinner from "@/components/spinner";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  or,
  getDocs,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";

// Unified Transaction type
interface Transaction {
  id: string;
  senderId?: string;
  recipientId?: string;
  recipientName?: string;
  amount: number;
  status: string;
  timestamp: Date;
  type: "transfer" | "deposit";
  details?: string; // 👈 Add this
}

export default function Page() {
  const loading = useAuthRedirect();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransfers, setTotalTransfers] = useState<number>(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const senderQuery = query(
      collection(db, "transferLogs"),
      where("senderId", "==", user.uid)
    );

    const depositQuery = query(
      collection(db, "transferLogs"),
      where("recipientId", "==", user.uid),
      where("type", "==", "deposit")
    );

    const unsubTransfers = onSnapshot(senderQuery, (snap) => {
      const transfers = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() ?? new Date(),
          type: "transfer",
        } as Transaction;
      });

      const confirmedTransfers = transfers.filter(
        (tx) => tx.status?.toLowerCase?.() === "completed"
      );

      const total = confirmedTransfers.reduce((sum, tx) => sum + tx.amount, 0);

      setTotalTransfers(total);

      // We'll merge with deposits later
      setTransactions((prev) =>
        [...transfers, ...prev.filter((tx) => tx.type === "deposit")].sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        )
      );
    });

    const unsubDeposits = onSnapshot(depositQuery, (snap) => {
      const deposits = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() ?? new Date(),
          type: "deposit",
        } as Transaction;
      });

      setTransactions((prev) =>
        [...deposits, ...prev.filter((tx) => tx.type === "transfer")].sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        )
      );
    });

    return () => {
      unsubTransfers();
      unsubDeposits();
    };
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
          <h1 className="text-2xl font-semibold">Transaction History</h1>

          {/* Total Transfers Card */}
          <Card className="bg-green-100/10 border-2 border-green-300 dark:border-green-600 shadow-md hover:shadow-lg">
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

          {/* Transactions */}
          {transactions.length === 0 ? (
            <p className="text-muted-foreground">No transactions found.</p>
          ) : (
            transactions.map((tx, idx) => (
              <Card
                key={idx}
                className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div>
                  <p className="font-medium capitalize">{tx.type}</p>
                  {tx.recipientName && (
                    <p className="text-sm text-muted-foreground">
                      {tx.recipientName}
                    </p>
                  )}
                  {tx.details && (
                    <p className="text-sm italic text-gray-500 dark:text-gray-400 mt-1">
                      {tx.details}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-500">
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
