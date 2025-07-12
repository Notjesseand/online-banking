// // app/admin/dashboard
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   collection,
//   onSnapshot,
//   getDocs,
//   DocumentData,
//   getDoc,
//   doc,
//   query,
//   where,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { db } from "@/lib/firebase";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// import { AppSidebar } from "../components/app-sidebar";
// import { SiteHeader } from "../components/site-header";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import Spinner from "@/components/spinner";
// import Link from "next/link";
// import Loading from "@/components/loading";

// function useAdminCheck() {
//   const [status, setStatus] = useState<
//     "loading" | "unauthorized" | "authorized"
//   >("loading");

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         setStatus("unauthorized");
//         return;
//       }

//       try {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists() && userDoc.data().role === "admin") {
//           setStatus("authorized");
//         } else {
//           setStatus("unauthorized");
//         }
//       } catch (err) {
//         console.error("Error fetching user role:", err);
//         setStatus("unauthorized");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return status;
// }

// export default function AdminOverviewPage() {
//   const [users, setUsers] = useState<DocumentData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [overallTransactionTotal, setOverallTransactionTotal] = useState(0);
//   const adminStatus = useAdminCheck();
//   const router = useRouter();

//   useEffect(() => {
//     if (adminStatus !== "authorized") return;

//     const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
//       const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setUsers(data);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [adminStatus]);

//   const getUserTransactionStats = async (userId: string) => {
//     const q = query(
//       collection(db, "transferLogs"),
//       where("senderId", "==", userId) // ✅ Use senderId to get user's sent transfers
//     );

//     const snapshot = await getDocs(q);

//     const completedTxs = snapshot.docs.filter(
//       (doc) => doc.data().status?.toLowerCase() === "completed"
//     );

//     const totalAmount = completedTxs.reduce(
//       (sum, doc) => sum + (doc.data().amount || 0),
//       0
//     );

//     const transactionCount = completedTxs.length;

//     return { totalAmount, transactionCount };
//   };

//   const getOverallTotalTransactions = async () => {
//     const snapshot = await getDocs(collection(db, "transferLogs"));
//     const total = snapshot.docs.reduce(
//       (sum, doc) => sum + (doc.data().amount || 0),
//       0
//     );
//     setOverallTransactionTotal(total);
//   };

//   useEffect(() => {
//     if (users.length > 0) {
//       const fetchStats = async () => {
//         const updatedUsers = await Promise.all(
//           users.map(async (user) => {
//             const stats = await getUserTransactionStats(user.id);
//             return { ...user, ...stats };
//           })
//         );
//         setUsers(updatedUsers);
//       };
//       fetchStats();
//       getOverallTotalTransactions(); // ✅ fetch overall total too
//     }
//   }, [users]);

//   if (adminStatus === "loading")
//     return (
//       <div className="p-6 font-montserrat h-full flex justify-center items-center">
//         Checking admin access...
//       </div>
//     );
//   if (adminStatus === "unauthorized") {
//     router.replace("/");
//     return null;
//   }
//   if (loading) return <Loading />;

//   const hasUserMessages = users.some((u) => u.hasNewUserMessage);

//   return (
//     <SidebarProvider>
//       <AppSidebar variant="inset" />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="p-6 font-montserrat space-y-6">
//           <h1 className="text-2xl font-bold">Admin Overview</h1>

//           <div className="flex flex-col md:flex-row gap-4">
//             <Card className="flex-1">
//               <CardHeader>
//                 <CardTitle>Total Transaction Amount</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-xl font-semibold">
//                   $
//                   {overallTransactionTotal.toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="flex-1">
//               <CardHeader>
//                 <CardTitle>New Messages</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Badge variant={hasUserMessages ? "destructive" : "secondary"}>
//                   {hasUserMessages ? "Yes" : "No"}
//                 </Badge>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>All Users</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="p-2">Name</th>
//                       <th className="p-2">Email</th>
//                       <th className="p-2">Phone</th>
//                       <th className="p-2">Total Transaction Amount</th>
//                       <th className="p-2">Transaction Count</th>
//                       <th className="p-2">Messages</th>
//                       <th className="p-2">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {users.map((u) => (
//                       <tr
//                         key={u.id}
//                         className="border-b hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
//                       >
//                         <td className="p-2">
//                           {u.firstName} {u.lastName}
//                         </td>
//                         <td className="p-2">{u.email}</td>
//                         <td className="p-2">{u.phone}</td>
//                         <td className="p-2">
//                           $
//                           {u.totalAmount?.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </td>
//                         <td className="p-2">{u.transactionCount}</td>
//                         <td className="p-2">
//                           <Badge
//                             variant={
//                               u.hasNewUserMessage ? "destructive" : "secondary"
//                             }
//                           >
//                             {u.hasNewUserMessage ? "New" : "None"}
//                           </Badge>
//                         </td>
//                         <td className="p-2">
//                           <Link href={`/admin/dashboard/${u.id}`}>
//                             <Button size="sm">View</Button>
//                           </Link>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

// app/admin/dashboard
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  getDocs,
  DocumentData,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { SiteHeader } from "../components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import Link from "next/link";
import Loading from "@/components/loading";

function useAdminCheck() {
  const [status, setStatus] = useState<
    "loading" | "unauthorized" | "authorized"
  >("loading");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus("unauthorized");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setStatus("authorized");
        } else {
          setStatus("unauthorized");
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setStatus("unauthorized");
      }
    });

    return () => unsubscribe();
  }, []);

  return status;
}

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallTransactionTotal, setOverallTransactionTotal] = useState(0);
  const adminStatus = useAdminCheck();
  const router = useRouter();

  const getUserTransactionStats = async (userId: string) => {
    const q = query(
      collection(db, "transferLogs"),
      where("senderId", "==", userId) // ✅ Use senderId for accurate tracking
    );

    const snapshot = await getDocs(q);

    const completedTxs = snapshot.docs.filter(
      (doc) => doc.data().status?.toLowerCase() === "completed"
    );

    const totalAmount = completedTxs.reduce(
      (sum, doc) => sum + (doc.data().amount || 0),
      0
    );

    const transactionCount = completedTxs.length;

    return { totalAmount, transactionCount };
  };

  const getOverallTotalTransactions = async () => {
    const snapshot = await getDocs(collection(db, "transferLogs"));
    const total = snapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().amount || 0),
      0
    );
    setOverallTransactionTotal(total);
  };

  useEffect(() => {
    if (adminStatus !== "authorized") return;

    const unsubscribe = onSnapshot(
      collection(db, "users"),
      async (snapshot) => {
        const rawUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const enrichedUsers = await Promise.all(
          rawUsers.map(async (user) => {
            const stats = await getUserTransactionStats(user.id);
            return { ...user, ...stats };
          })
        );

        setUsers(enrichedUsers);
        setLoading(false);
      }
    );

    getOverallTotalTransactions();

    return () => unsubscribe();
  }, [adminStatus]);

  if (adminStatus === "loading")
    return (
      <div className="p-6 font-montserrat h-full flex justify-center items-center">
        Checking admin access...
      </div>
    );
  if (adminStatus === "unauthorized") {
    router.replace("/");
    return null;
  }
  if (loading) return <Loading />;

  const hasUserMessages = users.some((u) => u.hasNewUserMessage);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 font-montserrat space-y-6">
          <h1 className="text-2xl font-bold">Admin Overview</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Total Transaction Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">
                  $
                  {overallTransactionTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader>
                <CardTitle>New Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={hasUserMessages ? "destructive" : "secondary"}>
                  {hasUserMessages ? "Yes" : "No"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2">Name</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">Total Transaction Amount</th>
                      <th className="p-2">Transaction Count</th>
                      <th className="p-2">Messages</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
                      >
                        <td className="p-2">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">{u.phone}</td>
                        <td className="p-2">
                          $
                          {u.totalAmount?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-2">{u.transactionCount}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              u.hasNewUserMessage ? "destructive" : "secondary"
                            }
                          >
                            {u.hasNewUserMessage ? "New" : "None"}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Link href={`/admin/dashboard/${u.id}`}>
                            <Button size="sm">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
