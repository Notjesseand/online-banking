//app/admin/dashboard/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AppSidebar } from "../../components/app-sidebar";
import { SiteHeader } from "../../components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/loading";
import { TransferHistory } from "@/components/transfer-history";

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  walletBalance?: number;
  hasNewMessages?: boolean;
  kyc?: Record<string, any>;
  pendingStatus?: boolean;
}

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingBalance, setEditingBalance] = useState(false);
  const [newBalance, setNewBalance] = useState<string>("");

  const [depositName, setDepositName] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      const ref = doc(db, "users", id as string);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        router.push("/admin");
        return;
      }

      setUser(snap.data() as UserData);
      setLoading(false);
    };

    fetchUser();
  }, [id, router]);

  const handleEditBalance = () => {
    setEditingBalance(true);
    setNewBalance((user?.walletBalance ?? 0).toString());
  };

  const handleSaveBalance = async () => {
    if (!user || !id) return;

    const balanceValue = parseFloat(newBalance);
    if (isNaN(balanceValue) || balanceValue < 0) {
      alert("Please enter a valid non-negative number.");
      return;
    }

    setBalanceLoading(true);

    try {
      await updateDoc(doc(db, "users", id as string), {
        walletBalance: balanceValue,
      });

      setUser((prev) =>
        prev ? { ...prev, walletBalance: balanceValue } : null
      );
      setEditingBalance(false);
    } catch (error) {
      console.error("Error updating balance:", error);
      alert("Failed to update balance. Please try again.");
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleCancelEditBalance = () => {
    setEditingBalance(false);
    setNewBalance("");
  };

  const handleDeposit = async () => {
    if (!id || !depositAmount || !depositName) return;
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Enter a valid amount greater than zero.");
      return;
    }

    setDepositLoading(true);

    try {
      const userRef = doc(db, "users", id as string);
      const currentSnap = await getDoc(userRef);
      const currentData = currentSnap.data();
      const currentBalance = currentData?.walletBalance || 0;

      await updateDoc(userRef, {
        walletBalance: currentBalance + amountNum,
      });

      await addDoc(collection(db, "transferLogs"), {
        recipientId: id,
        recipientName: depositName,
        amount: amountNum,
        status: "Completed",
        timestamp: serverTimestamp(),
        type: "deposit",
      });

      alert(`Deposit of $${amountNum} to ${depositName} was successful!`);
      setDepositAmount("");
      setDepositName("");

      // Refresh user data
      const updatedSnap = await getDoc(userRef);
      setUser(updatedSnap.data() as UserData);
    } catch (error) {
      console.error("Deposit failed:", error);
      alert("Deposit failed. Try again.");
    } finally {
      setDepositLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!user) return <div className="p-6">User not found.</div>;

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 font-montserrat space-y-6">
          <h1 className="text-sm md:text-base font-bold">User Details</h1>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {fullName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user.email ?? "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone ?? "N/A"}
              </p>
              <div className="flex items-center gap-2">
                <strong>Wallet Balance:</strong>
                {editingBalance ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      placeholder="Enter new balance"
                      className="w-32 text-sm"
                      min="0"
                      step="0.01"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveBalance}
                      disabled={balanceLoading}
                    >
                      {balanceLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEditBalance}
                      disabled={balanceLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <span>${user.walletBalance?.toLocaleString() ?? "0"}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEditBalance}
                      disabled={balanceLoading}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
              <p>
                <strong>Pending Status:</strong>{" "}
                {user.pendingStatus ? "True" : "False"}
              </p>
            </CardContent>
          </Card>

          {/* ✅ Admin Deposit Section */}
          <Card className="text-sm">
            <CardHeader>
              <CardTitle className="text-sm">Make Deposit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Name for deposit (e.g. Admin or Reason)"
                value={depositName}
                onChange={(e) => setDepositName(e.target.value)}
              />
              <Input
                placeholder="Amount to deposit"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <Button onClick={handleDeposit} disabled={depositLoading}>
                {depositLoading ? "Depositing..." : "Deposit"}
              </Button>
            </CardContent>
          </Card>

          {/* ✅ Transfer History for this user only */}
          <Card className="text-sm">
            <CardHeader>
              <CardTitle className="text-sm">Transfer History</CardTitle>
            </CardHeader>
            <CardContent>
              <TransferHistory filterByUserId={id as string} />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
