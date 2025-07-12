import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Loader } from "lucide-react";

export const TransferForm = () => {
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchRecipientName = async () => {
      if (recipientId.length !== 10) {
        setRecipientName("");
        return;
      }
      try {
        const q = query(
          collection(db, "recipients"),
          where("accountNumber", "==", recipientId)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const recipientData = querySnapshot.docs[0].data();
          setRecipientName(recipientData.name || "Unknown Recipient");
        } else {
          const qId = query(
            collection(db, "recipients"),
            where("idNumber", "==", recipientId)
          );
          const idSnapshot = await getDocs(qId);
          if (!idSnapshot.empty) {
            const recipientData = idSnapshot.docs[0].data();
            setRecipientName(recipientData.name || "Unknown Recipient");
          } else {
            setRecipientName("Recipient not found");
          }
        }
      } catch (err) {
        setError("Error fetching recipient. Please try again.");
        setRecipientName("");
      }
    };

    fetchRecipientName();

    // Fetch wallet balance
    const user = auth.currentUser;
    if (user) {
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
    }
  }, [recipientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);

    if (
      !amount ||
      !recipientId ||
      !recipientName ||
      recipientName === "Recipient not found" ||
      recipientId.length !== 10
    ) {
      setError(
        "Please enter a valid 10-digit recipient ID or account number and amount."
      );
      return;
    }
    if (amountNum <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    if (walletBalance === null || amountNum > walletBalance) {
      setError(
        "Insufficient funds. Please enter an amount within your balance."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Log the transfer
      await addDoc(collection(db, "transferLogs"), {
        senderId: user.uid, // ✅ Add senderId for linking
        recipientId,
        recipientName,
        amount: amountNum,
        status: "Completed",
        timestamp: serverTimestamp(),
      });

      // Update wallet balance
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        walletBalance: walletBalance - amountNum,
      });

      setError("");
      alert(
        `Transfer of $${amount} to ${recipientName} (ID: ${recipientId}) was successful!`
      );
      setAmount("");
      setRecipientId("");
      setRecipientName("");
    } catch (err) {
      setError("Error processing transfer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg"
    >
      {error && <p className="text-red-400 text-sm -mt-2">{error}</p>}

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">
          Recipient ID or Account Number
        </label>
        <input
          type="text"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          maxLength={10}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="Enter 10-digit account number or ID"
        />
      </div>

      {recipientId.length === 10 && (
        <div>
          {/* <label className="block text-sm font-semibold text-gray-300 mb-1">
            Recipient Name
          </label> */}
          <input
            type="text"
            value={recipientName}
            readOnly
            className="w-full rounded-lg bg-gray-700 text-white border bg-transparent cursor-not-allowed"
            placeholder="fetching..."
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">
          Amount ($)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0"
          max={walletBalance || undefined}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
          placeholder="Enter amount"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-lg font-bold transition-colors duration-300 ${
          isSubmitting
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        } flex items-center justify-center`}
      >
        {isSubmitting ? (
          <>
            <Loader className="animate-spin mr-2 h-5 w-5" />
            Sending...
          </>
        ) : (
          "Send Money"
        )}
      </button>
    </form>
  );
};
