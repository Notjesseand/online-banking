// // app/safe/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { doc, onSnapshot, updateDoc } from "firebase/firestore";
// import { db, auth } from "@/lib/firebase";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { AppSidebar } from "@/components/app-sidebar";
// import { SiteHeader } from "@/components/site-header";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { Button } from "@/components/ui/button";
// import Loading from "@/components/loading";
// import { toast } from "@/components/ui/use-toast";
// import { motion } from "framer-motion";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"; // Assuming shadcn/ui alert-dialog
// import "@/styles/star-background.css";

// type SafeEntry = {
//   id: string;
//   amount: number;
//   startDate: string;
//   lockedUntil: string;
//   assetType: string;
// };

// export default function SafePage() {
//   const [safeEntries, setSafeEntries] = useState<SafeEntry[]>([]);
//   const [walletBalance, setWalletBalance] = useState<number>(0);
//   const [loading, setLoading] = useState(true);
//   const [inputAmount, setInputAmount] = useState<number>(0);
//   const [selectedAsset, setSelectedAsset] = useState<string>("USD");
//   const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
//   const [showInsufficientDialog, setShowInsufficientDialog] = useState(false);

//   const assetOptions = [
//     { value: "USD", label: "USD (US Dollar)" },
//     { value: "BTC", label: "BTC (Bitcoin)" },
//     { value: "ETH", label: "ETH (Ethereum)" },
//     { value: "SOL", label: "SOL (Solana)" },
//   ];

//   // Fetch safe data and wallet balance for the authenticated user
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;
//     const ref = doc(db, "users", user.uid);
//     return onSnapshot(ref, (docSnap) => {
//       const data = docSnap.data();
//       setSafeEntries(data?.safe?.entries ?? []);
//       setWalletBalance(data?.walletBalance ?? 0);
//       setLoading(false);
//     });
//   }, []);

//   // Lock money in the safe
//   const lockMoney = async () => {
//     if (inputAmount <= 0) {
//       toast({
//         title: "Error",
//         description: "Please enter a valid amount greater than 0.",
//       });
//       return;
//     }
//     if (inputAmount > walletBalance) {
//       toast({
//         title: "Error",
//         description: "Insufficient balance in your wallet.",
//       });
//       return;
//     }
//     const user = auth.currentUser;
//     if (!user) return;
//     const ref = doc(db, "users", user.uid);
//     const id = Date.now().toString(); // Unique ID based on timestamp
//     const startDate = new Date().toISOString();
//     const lockedUntil = new Date(
//       new Date().setFullYear(new Date().getFullYear() + 1)
//     ).toISOString();
//     const newEntry: SafeEntry = {
//       id,
//       amount: inputAmount,
//       startDate,
//       lockedUntil,
//       assetType: selectedAsset,
//     };
//     const newBalance = walletBalance - inputAmount;
//     await updateDoc(ref, {
//       "safe.entries": [...safeEntries, newEntry],
//       walletBalance: newBalance,
//     });
//     setInputAmount(0); // Reset input
//     setWalletBalance(newBalance); // Update local state
//     toast({
//       title: "Success",
//       description: `Funds locked in ${selectedAsset} for 1 year!`,
//     });
//   };

//   // Withdraw money from a specific safe entry
//   const withdrawMoney = async (id: string) => {
//     const entry = safeEntries.find((e) => e.id === id);
//     if (!entry) return;

//     const user = auth.currentUser;
//     if (!user) return;
//     const ref = doc(db, "users", user.uid);
//     const now = new Date();
//     const lockedUntil = new Date(entry.lockedUntil);
//     let amountToWithdraw = entry.amount;

//     if (now < lockedUntil) {
//       const fee = entry.amount * 0.15; // 15% fee
//       if (walletBalance < fee) {
//         setSelectedEntryId(id);
//         setShowInsufficientDialog(true);
//         return;
//       }
//       amountToWithdraw -= fee;
//       toast({
//         title: "Early Withdrawal",
//         description: `Withdrawn ${amountToWithdraw.toFixed(2)} ${entry.assetType}. A 15% fee of ${fee.toFixed(2)} ${entry.assetType} was applied.`,
//       });
//     } else {
//       const interest = entry.amount * 0.17; // 17% annual return
//       amountToWithdraw += interest;
//       toast({
//         title: "Withdrawal",
//         description: `Withdrawn ${amountToWithdraw.toFixed(2)} ${entry.assetType} including 17% interest.`,
//       });
//     }

//     const updatedEntries = safeEntries.filter((e) => e.id !== id);
//     const newBalance = walletBalance + amountToWithdraw;
//     await updateDoc(ref, {
//       "safe.entries": updatedEntries,
//       walletBalance: newBalance,
//     });
//     setSafeEntries(updatedEntries);
//     setWalletBalance(newBalance); // Update local state
//     setSelectedEntryId(null);
//   };

//   // Calculate estimated return for a specific entry (invested amount + 17%)
//   const calculateReturn = (entry: SafeEntry) => {
//     if (!entry.startDate || !entry.lockedUntil) return 0;
//     const now = new Date();
//     const lockedUntil = new Date(entry.lockedUntil);
//     if (now > lockedUntil) {
//       return entry.amount + entry.amount * 0.17; // Full amount + 17% after 1 year
//     }
//     const monthsLocked =
//       (now.getTime() - new Date(entry.startDate).getTime()) /
//       (1000 * 60 * 60 * 24 * 30);
//     return entry.amount + entry.amount * 0.17 * (monthsLocked / 12); // Pro-rated total value
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="relative p-0 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
//       <div className="z-10 absolute inset-0 pointer-events-none">
//         <div className="stars small" />
//         <div className="stars medium" />
//         <div className="stars large" />
//       </div>
//       <SidebarProvider>
//         <AppSidebar variant="inset" />
//         <SidebarInset>
//           <SiteHeader />
//           <div className="flex flex-1 flex-col items-center justify-center min-h-screen font-montserrat z-50 px-6">
//             <motion.div
//               className="w-full max-w-4xl"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Card className="bg-gradient-to-br from-green-50 to-white shadow-lg rounded-xl border border-green-200 mb-6">
//                 <CardHeader className="text-center">
//                   <CardTitle className="text-2xl font-bold text-green-800">
//                     Lock New Funds
//                   </CardTitle>
//                   <CardDescription className="text-gray-600">
//                     Lock your money for 1 year and earn 17% return per annum.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4 text-center">
//                   <p className="text-md font-medium text-gray-700">
//                     Wallet Balance: {walletBalance.toFixed(2)} {selectedAsset}
//                   </p>
//                   <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
//                     <input
//                       type="number"
//                       placeholder="Enter amount"
//                       className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-sm font-montserrat text-center"
//                       value={inputAmount || ""}
//                       onChange={(e) =>
//                         setInputAmount(parseFloat(e.target.value) || 0)
//                       }
//                       min="1"
//                     />
//                     <Select
//                       onValueChange={setSelectedAsset}
//                       value={selectedAsset}
//                     >
//                       <SelectTrigger className="w-full md:w-1/3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500">
//                         <SelectValue placeholder="Select Asset Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {assetOptions.map((option) => (
//                           <SelectItem
//                             key={option.value}
//                             value={option.value}
//                             className="font-montserrat"
//                           >
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   {inputAmount > walletBalance && (
//                     <p className="text-sm text-red-500 font-medium">
//                       Amount exceeds available balance.
//                     </p>
//                   )}
//                 </CardContent>
//                 <CardFooter className="flex justify-center p-6">
//                   <Button
//                     onClick={lockMoney}
//                     className="w-full md:w-auto bg-green-600 text-white hover:bg-green-700 transition-colors disabled:bg-gray-400"
//                     disabled={inputAmount <= 0 || inputAmount > walletBalance}
//                   >
//                     Lock Funds
//                   </Button>
//                 </CardFooter>
//               </Card>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {safeEntries.map((entry) => (
//                   <motion.div
//                     key={entry.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     <Card className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl border border-blue-200">
//                       <CardHeader className="text-center">
//                         <CardTitle className="text-xl font-semibold text-blue-800">
//                           Safe Entry #{entry.id.slice(-6)}
//                         </CardTitle>
//                         <CardDescription className="text-gray-600">
//                           Asset: {entry.assetType}
//                         </CardDescription>
//                       </CardHeader>
//                       <CardContent className="space-y-2 text-center">
//                         <p className="text-lg font-semibold text-gray-700">
//                           Amount: {entry.amount.toFixed(2)} {entry.assetType}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Locked Date:{" "}
//                           {new Date(entry.startDate).toLocaleDateString()}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Due Date:{" "}
//                           {new Date(entry.lockedUntil).toLocaleDateString()}
//                         </p>
//                         <p className="text-lg font-semibold text-green-600">
//                           Est. Return: {/* @ts-ignore */}
//                           {calculateReturn(entry).toFixed(2) * 1.17}{" "}
//                           {entry.assetType}
//                         </p>
//                         {new Date() < new Date(entry.lockedUntil) && (
//                           <p className="text-sm text-red-500 font-medium">
//                             Early withdrawal incurs a 15% fee.
//                           </p>
//                         )}
//                       </CardContent>
//                       <CardFooter className="flex justify-center p-4 font-montserrat">
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button
//                               variant="destructive"
//                               className="w-full bg-red-600 text-white hover:bg-red-700 transition-colors"
//                             >
//                               Withdraw
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle className="font-montserrat">
//                                 Confirm Withdrawal
//                               </AlertDialogTitle>
//                               <AlertDialogDescription className="font-montserrat">
//                                 {new Date() < new Date(entry.lockedUntil) &&
//                                   walletBalance < entry.amount * 0.15 && (
//                                     <p className="text-red-500">
//                                       You need at least {entry.amount * 0.15}{" "}
//                                       {entry.assetType} in your wallet to cover
//                                       the 15% early withdrawal fee. Current
//                                       balance: {walletBalance.toFixed(2)}{" "}
//                                       {entry.assetType}.
//                                     </p>
//                                   )}
//                                 {new Date() >= new Date(entry.lockedUntil) && (
//                                   <p className="font-montserrat">
//                                     Are you sure you want to withdraw this
//                                     amount with 17% interest?
//                                   </p>
//                                 )}
//                                 {new Date() < new Date(entry.lockedUntil) &&
//                                   walletBalance >= entry.amount * 0.15 && (
//                                     <p className="font-montserrat">
//                                       Are you sure you want to withdraw with a
//                                       15% fee?
//                                     </p>
//                                   )}
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter className="font-montserrat">
//                               <AlertDialogCancel
//                                 onClick={() => setSelectedEntryId(null)}
//                               >
//                                 Cancel
//                               </AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => withdrawMoney(entry.id)}
//                                 disabled={
//                                   new Date() < new Date(entry.lockedUntil) &&
//                                   walletBalance < entry.amount * 0.15
//                                 }
//                               >
//                                 Confirm
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </CardFooter>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </SidebarInset>
//       </SidebarProvider>
//     </div>
//   );
// }

// app/safe/page.tsx
"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Assuming shadcn/ui alert-dialog
import "@/styles/star-background.css";

type SafeEntry = {
  id: string;
  amount: number;
  startDate: string;
  lockedUntil: string;
  assetType: string;
};

export default function SafePage() {
  const [safeEntries, setSafeEntries] = useState<SafeEntry[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [inputAmount, setInputAmount] = useState<number>(0);
  const [selectedAsset, setSelectedAsset] = useState<string>("USD");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false);

  const assetOptions = [
    { value: "USD", label: "USD (US Dollar)" },
    { value: "BTC", label: "BTC (Bitcoin)" },
    { value: "ETH", label: "ETH (Ethereum)" },
    { value: "SOL", label: "SOL (Solana)" },
  ];

  // Fetch safe data and wallet balance for the authenticated user
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    return onSnapshot(ref, (docSnap) => {
      const data = docSnap.data();
      setSafeEntries(data?.safe?.entries ?? []);
      setWalletBalance(data?.walletBalance ?? 0);
      setLoading(false);
    });
  }, []);

  // Lock money in the safe
  const lockMoney = async () => {
    if (inputAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0.",
      });
      return;
    }
    if (inputAmount > walletBalance) {
      toast({
        title: "Error",
        description: "Insufficient balance in your wallet.",
      });
      return;
    }
    const user = auth.currentUser;
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const id = Date.now().toString(); // Unique ID based on timestamp
    const startDate = new Date().toISOString();
    const lockedUntil = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ).toISOString();
    const newEntry: SafeEntry = {
      id,
      amount: inputAmount,
      startDate,
      lockedUntil,
      assetType: selectedAsset,
    };
    const newBalance = walletBalance - inputAmount;
    await updateDoc(ref, {
      "safe.entries": [...safeEntries, newEntry],
      walletBalance: newBalance,
    });
    setInputAmount(0); // Reset input
    setWalletBalance(newBalance); // Update local state
    toast({
      title: "Success",
      description: `Funds locked in ${selectedAsset} for 1 year!`,
    });
  };

  // Withdraw money from a specific safe entry
  const withdrawMoney = async (id: string) => {
    const entry = safeEntries.find((e) => e.id === id);
    if (!entry) return;

    const user = auth.currentUser;
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const now = new Date();
    const lockedUntil = new Date(entry.lockedUntil);
    let amountToWithdraw = entry.amount;

    if (now < lockedUntil) {
      const fee = entry.amount * 0.15; // 15% fee
      if (walletBalance < fee) {
        setSelectedEntryId(id);
        setShowInsufficientDialog(true);
        return;
      }
      amountToWithdraw -= fee;
      toast({
        title: "Early Withdrawal",
        description: `Withdrawn ${amountToWithdraw.toFixed(2)} ${entry.assetType}. A 15% fee of ${fee.toFixed(2)} ${entry.assetType} was applied.`,
      });
    } else {
      const interest = entry.amount * 0.17; // 17% annual return
      amountToWithdraw += interest;
      toast({
        title: "Withdrawal",
        description: `Withdrawn ${amountToWithdraw.toFixed(2)} ${entry.assetType} including 17% interest.`,
      });
    }

    const updatedEntries = safeEntries.filter((e) => e.id !== id);
    const newBalance = walletBalance + amountToWithdraw;
    await updateDoc(ref, {
      "safe.entries": updatedEntries,
      walletBalance: newBalance,
    });
    setSafeEntries(updatedEntries);
    setWalletBalance(newBalance); // Update local state
    setSelectedEntryId(null);
  };

  // Calculate estimated return for a specific entry (invested amount + 17%)
  const calculateReturn = (entry: SafeEntry) => {
    if (!entry.startDate || !entry.lockedUntil) return 0;
    const now = new Date();
    const lockedUntil = new Date(entry.lockedUntil);
    if (now > lockedUntil) {
      return entry.amount + entry.amount * 0.17; // Full amount + 17% after 1 year
    }
    const monthsLocked =
      (now.getTime() - new Date(entry.startDate).getTime()) /
      (1000 * 60 * 60 * 24 * 30);
    return entry.amount + entry.amount * 0.17 * (monthsLocked / 12); // Pro-rated total value
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative p-0 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="z-10 absolute inset-0 pointer-events-none">
        <div className="stars small" />
        <div className="stars medium" />
        <div className="stars large" />
      </div>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col items-center justify-center min-h-screen font-montserrat z-50 px-6">
            <motion.div
              className="w-full max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-white shadow-lg rounded-xl border border-green-200 mb-6">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-green-800">
                    Lock New Funds
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Lock your money for 1 year and earn 17% return per annum.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <p className="text-md font-medium text-gray-700">
                    Wallet Balance: {walletBalance.toFixed(2)} {selectedAsset}
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-sm font-montserrat text-center"
                      value={inputAmount || ""}
                      onChange={(e) =>
                        setInputAmount(parseFloat(e.target.value) || 0)
                      }
                      min="1"
                    />
                    <Select
                      onValueChange={setSelectedAsset}
                      value={selectedAsset}
                    >
                      <SelectTrigger className="w-full md:w-1/3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500">
                        <SelectValue placeholder="Select Asset Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="font-montserrat"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {inputAmount > walletBalance && (
                    <p className="text-sm text-red-500 font-medium">
                      Amount exceeds available balance.
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center p-6">
                  <Button
                    onClick={lockMoney}
                    className="w-full md:w-auto bg-green-600 text-white hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    disabled={inputAmount <= 0 || inputAmount > walletBalance}
                  >
                    Lock Funds
                  </Button>
                </CardFooter>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl border border-blue-200">
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl font-semibold text-blue-800">
                          Safe Entry #{entry.id.slice(-6)}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          Asset: {entry.assetType}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-center">
                        <p className="text-lg font-semibold text-gray-700">
                          Amount: {entry.amount.toFixed(2)} {entry.assetType}
                        </p>
                        <p className="text-sm text-gray-600">
                          Locked Date:{" "}
                          {new Date(entry.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Due Date:{" "}
                          {new Date(entry.lockedUntil).toLocaleDateString()}
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          Est. Return: {calculateReturn(entry).toFixed(2)}{" "}
                          {entry.assetType}
                        </p>
                        {new Date() < new Date(entry.lockedUntil) && (
                          <p className="text-sm text-red-500 font-medium">
                            Early withdrawal incurs a 15% fee.
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-center p-4 font-montserrat">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="w-full bg-black text-white hover:bg-slate-800 transition-colors"
                            >
                              Withdraw
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-montserrat">
                                Confirm Withdrawal
                              </AlertDialogTitle>
                              <AlertDialogDescription className="font-montserrat">
                                {new Date() < new Date(entry.lockedUntil) &&
                                  walletBalance < entry.amount * 0.15 && (
                                    <p className="text-red-500">
                                      You need at least{" "}
                                      {(entry.amount * 0.15).toFixed(2)}{" "}
                                      {entry.assetType} in your wallet to cover
                                      the 15% early withdrawal fee. Current
                                      balance: {walletBalance.toFixed(2)}{" "}
                                      {entry.assetType}.
                                    </p>
                                  )}
                                {new Date() >= new Date(entry.lockedUntil) && (
                                  <p className="font-montserrat">
                                    Are you sure you want to withdraw this
                                    amount with 17% interest?
                                  </p>
                                )}
                                {new Date() < new Date(entry.lockedUntil) &&
                                  walletBalance >= entry.amount * 0.15 && (
                                    <p className="font-montserrat">
                                      Are you sure you want to withdraw with a
                                      15% fee?
                                    </p>
                                  )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="font-montserrat">
                              <AlertDialogCancel
                                onClick={() => setSelectedEntryId(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => withdrawMoney(entry.id)}
                                disabled={
                                  new Date() < new Date(entry.lockedUntil) &&
                                  walletBalance < entry.amount * 0.15
                                }
                              >
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
