"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  limit,
  query,
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

export const TransferHistory = () => {
  const [transfers, setTransfers] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "transferLogs"),
        orderBy("timestamp", "desc"),
        limit(3)
      ),
      (snap) => {
        const data = snap.docs.map((doc) => {
          const docData = doc.data();
          const timestamp = docData.timestamp
            ? docData.timestamp.toDate()
            : new Date(); // Fallback to current date if timestamp is missing
          if (!docData.timestamp) {
            console.warn(`Missing timestamp for document ${doc.id}`);
          }
          return {
            id: doc.id,
            ...docData,
            timestamp,
            amount: docData.amount || 0,
          } as Transaction;
        });
        setTransfers(data);
      },
      (error) => {
        console.error("Error fetching transfer history:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold text-white mb-4">
        Recent Transfers
      </h3>
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase bg-gray-800 text-gray-400">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Recipient</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
