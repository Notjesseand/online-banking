"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaArrowRight } from "react-icons/fa";

interface Transaction {
  id: string;
  recipientId: string;
  recipientName: string;
  amount: number;
  status: string;
  timestamp: Date;
  type: string; // "deposit" or "transfer"
}

export const TransferHistory = ({
  filterByUserId,
}: {
  filterByUserId?: string;
}) => {
  const [transfers, setTransfers] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!filterByUserId) return;

    const transferQuery = query(
      collection(db, "transferLogs"),
      where("senderId", "==", filterByUserId),
      orderBy("timestamp", "desc")
    );

    const depositQuery = query(
      collection(db, "transferLogs"),
      where("recipientId", "==", filterByUserId),
      where("type", "==", "deposit"),
      orderBy("timestamp", "desc")
    );

    const unsubTransfers = onSnapshot(transferQuery, (snap) => {
      const transferData = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() || new Date(),
          amount: data.amount || 0,
          type: data.type || "transfer",
        } as Transaction;
      });

      setTransfers((prev) => {
        // Avoid duplicates
        const existing = new Set(prev.map((t) => t.id));
        const combined = [
          ...prev,
          ...transferData.filter((t) => !existing.has(t.id)),
        ];
        return combined.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );
      });
    });

    const unsubDeposits = onSnapshot(depositQuery, (snap) => {
      const depositData = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() || new Date(),
          amount: data.amount || 0,
          type: "deposit",
        } as Transaction;
      });

      setTransfers((prev) => {
        const existing = new Set(prev.map((t) => t.id));
        const combined = [
          ...prev,
          ...depositData.filter((t) => !existing.has(t.id)),
        ];
        return combined.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );
      });
    });

    return () => {
      unsubTransfers();
      unsubDeposits();
    };
  }, [filterByUserId]);

  return (
    <div className="overflow-x-auto text-xs">
      <h3 className="text-lg font-semibold text-white mb-4">
        Recent Transactions
      </h3>
      <table className="w-full text-sm lg:text-xs text-left text-gray-300">
        <thead className="text-xs uppercase bg-gray-800 text-gray-400">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Recipient</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Fees</th>
          </tr>
        </thead>
        <tbody>
          {transfers.length > 0 ? (
            transfers.map((transfer) => (
              <tr
                key={transfer.id}
                className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800 transition-all"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(transfer.timestamp).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Africa/Lagos",
                  })}
                </td>
                <td className="px-4 py-3 font-semibold text-green-400">
                  ${transfer.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 flex items-center gap-2 text-white">
                  <FaArrowRight className="text-blue-400 text-xs" />
                  {transfer.recipientName || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      transfer.status === "Completed"
                        ? "bg-green-700 text-green-200"
                        : "bg-yellow-700 text-yellow-200"
                    }`}
                  >
                    {transfer.status}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize text-white">
                  {transfer.type}
                </td>
                <td className="px-5">$0</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                No transactions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
