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
}

export const TransferHistory = ({
  filterByUserId,
}: {
  filterByUserId?: string;
}) => {
  const [transfers, setTransfers] = useState<Transaction[]>([]);
  console.log(filterByUserId, "jajajajaj");
  console.log(typeof filterByUserId, filterByUserId);

  useEffect(() => {
    if (!filterByUserId) return;

    const q = query(
      collection(db, "transferLogs"),
      where("senderId", "==", filterByUserId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
            timestamp: docData.timestamp?.toDate?.() || new Date(),
            amount: docData.amount || 0,
          } as Transaction;
        });
        setTransfers(data);
      },
      (error) => {
        console.error("Error fetching user transfer history:", error);
      }
    );

    return () => unsubscribe();
  }, [filterByUserId]);

  return (
    <div className="overflow-x-auto text-xs">
      <h3 className="text-lg font-semibold text-white mb-4">
        Recent Transfers
      </h3>
      <table className="w-full text-sm lg:text-xs text-left text-gray-300">
        <thead className="text-xs uppercase bg-gray-800 text-gray-400">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Recipient</th>
            <th className="px-4 py-3">Status</th>
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
                  {transfer.recipientName}
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
                <td className="px-5">$0</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                No transfers yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
