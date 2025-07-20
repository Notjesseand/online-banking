// "use client";

// import { useEffect, useState } from "react";
// import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// import { AppSidebar } from "../components/app-sidebar";
// import { SiteHeader } from "../components/site-header";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import PopulateRecipients from "@/hooks/addrecipients";

// // Utility to create a slug from a name
// const slugify = (text: string) =>
//   text
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w-]+/g, "")
//     .replace(/--+/g, "-")
//     .replace(/^-+|-+$/g, "");

// type Recipient = {
//   id: string;
//   name: string;
//   accountNumber: string;
//   idNumber?: string;
// };

// export default function AdminPage() {
//   const [recipients, setRecipients] = useState<Recipient[]>([]);
//   const [newRecipient, setNewRecipient] = useState<Partial<Recipient>>({});
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const unsubRecipients = onSnapshot(collection(db, "recipients"), (snap) =>
//       setRecipients(
//         snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Recipient)
//       )
//     );
//     return () => unsubRecipients();
//   }, []);

//   const handleAddRecipient = async () => {
//     if (!newRecipient.name || !newRecipient.accountNumber) {
//       setError("Name and account number are required.");
//       return;
//     }

//     if (newRecipient.accountNumber.length < 10) {
//       setError("Account number must be at least 10 digits.");
//       return;
//     }

//     const id = newRecipient.id?.trim() || slugify(newRecipient.name || "");
//     if (!id) {
//       setError("Please enter a name to generate an ID.");
//       return;
//     }

//     const recipientData = {
//       id,
//       name: newRecipient.name,
//       accountNumber: newRecipient.accountNumber,
//       idNumber: newRecipient.idNumber || "",
//     };

//     try {
//       const ref = doc(db, "recipients", id);
//       await setDoc(ref, recipientData);
//       setNewRecipient({});
//       setError(null);
//     } catch (err) {
//       setError("Failed to add recipient. Please try again.");
//     }
//   };

//   const renderLabeledInputs = (
//     data: any,
//     setData: (val: any) => void,
//     fields: { name: string; label: string; required?: boolean }[]
//   ) => (
//     <div className="grid md:grid-cols-3 gap-4 my-2">
//       {fields.map(({ name, label, required = false }) => (
//         <div key={name} className="space-y-1">
//           <Label className="text-xs text-muted-foreground">
//             {label} {required && <span className="text-red-500">*</span>}
//           </Label>
//           <Input
//             placeholder={label}
//             value={data[name] || ""}
//             onChange={(e) =>
//               setData((prev: any) => ({ ...prev, [name]: e.target.value }))
//             }
//             minLength={name === "accountNumber" ? 10 : undefined}
//           />
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <SidebarProvider>
//       <AppSidebar variant="inset" />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="p-6 font-montserrat space-y-10">
//           <h1 className="text-2xl font-bold">Manage Recipients</h1>

//           <Card className="font-montserrat">
//             <CardHeader>
//               <CardTitle>Add New Recipient</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//               {renderLabeledInputs(newRecipient, setNewRecipient, [
//                 { name: "name", label: "Recipient Name", required: true },
//                 {
//                   name: "accountNumber",
//                   label: "Account Number",
//                   required: true,
//                 },
//                 { name: "idNumber", label: "ID Number (Optional)" },
//               ])}
//               <Button onClick={handleAddRecipient} className="mt-4">
//                 Add Recipient
//               </Button>
//               <div className="text-center text-sm pt-6">
//                 <p className="">generate recipients</p>
//                 <PopulateRecipients />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="font-montserrat">
//             <CardHeader>
//               <CardTitle>Existing Recipients</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto mt-4">
//                 <table className="min-w-[600px] text-sm border w-full">
//                   <thead>
//                     <tr>
//                       {["ID", "Name", "Account Number", "ID Number"].map(
//                         (h) => (
//                           <th key={h} className="border px-2 py-1 text-left">
//                             {h}
//                           </th>
//                         )
//                       )}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {recipients.map((r) => (
//                       <tr key={r.id} className="border">
//                         {["id", "name", "accountNumber", "idNumber"].map(
//                           (key) => (
//                             <td className="px-2 py-1" key={key}>
//                               {r[key as keyof Recipient] || "N/A"}
//                             </td>
//                           )
//                         )}
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

"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { SiteHeader } from "../components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clipboard } from "lucide-react"; // Import Clipboard icon from Lucide React
import PopulateRecipients from "@/hooks/addrecipients";
import { toast } from "sonner";

// Utility to create a slug from a name
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

type Recipient = {
  id: string;
  name: string;
  accountNumber: string;
  idNumber?: string;
};

export default function AdminPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newRecipient, setNewRecipient] = useState<Partial<Recipient>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubRecipients = onSnapshot(collection(db, "recipients"), (snap) =>
      setRecipients(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Recipient)
      )
    );
    return () => unsubRecipients();
  }, []);

  const handleAddRecipient = async () => {
    if (!newRecipient.name || !newRecipient.accountNumber) {
      setError("Name and account number are required.");
      return;
    }

    if (newRecipient.accountNumber.length < 10) {
      setError("Account number must be at least 10 digits.");
      return;
    }

    const id = newRecipient.id?.trim() || slugify(newRecipient.name || "");
    if (!id) {
      setError("Please enter a name to generate an ID.");
      return;
    }

    const recipientData = {
      id,
      name: newRecipient.name,
      accountNumber: newRecipient.accountNumber,
      idNumber: newRecipient.idNumber || "",
    };

    try {
      const ref = doc(db, "recipients", id);
      await setDoc(ref, recipientData);
      setNewRecipient({});
      setError(null);
    } catch (err) {
      setError("Failed to add recipient. Please try again.");
    }
  };

  // Function to copy account number to clipboard
  const copyToClipboard = (accountNumber: string) => {
    navigator.clipboard
      .writeText(accountNumber)
      .then(() => {
        toast(`copied to clipboard!`);
      })
      .catch(() => {
        toast("Failed to copy account number.");
      });
  };

  const renderLabeledInputs = (
    data: any,
    setData: (val: any) => void,
    fields: { name: string; label: string; required?: boolean }[]
  ) => (
    <div className="grid md:grid-cols-3 gap-4 my-2">
      {fields.map(({ name, label, required = false }) => (
        <div key={name} className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            placeholder={label}
            value={data[name] || ""}
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, [name]: e.target.value }))
            }
            minLength={name === "accountNumber" ? 10 : undefined}
          />
        </div>
      ))}
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 font-montserrat space-y-10">
          <h1 className="text-2xl font-bold">Manage Recipients</h1>

          <Card className="font-montserrat">
            <CardHeader>
              <CardTitle>Add New Recipient</CardTitle>
            </CardHeader>
            <CardContent>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              {renderLabeledInputs(newRecipient, setNewRecipient, [
                { name: "name", label: "Recipient Name", required: true },
                {
                  name: "accountNumber",
                  label: "Account Number",
                  required: true,
                },
                { name: "idNumber", label: "ID Number (Optional)" },
              ])}
              <Button onClick={handleAddRecipient} className="mt-4">
                Add Recipient
              </Button>
              <div className="text-center text-xs pt-6">
                <p className="">generate recipients</p>
                <PopulateRecipients />
              </div>
            </CardContent>
          </Card>

          <Card className="font-montserrat">
            <CardHeader>
              <CardTitle>Existing Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-[600px] text-xs border w-full ">
                  <thead>
                    <tr>
                      {["ID", "Name", "Account Number", "ID Number"].map(
                        (h) => (
                          <th key={h} className="border px-2 py-1 text-left">
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {recipients.map((r) => (
                      <tr key={r.id} className="border">
                        <td className="px-2 py-1">{r.id}</td>
                        <td className="px-2 py-1">{r.name}</td>
                        <td className="px-2 py-1 flex justify-between gap-2 ">
                          {r.accountNumber || "N/A"}
                          <button
                            onClick={() => copyToClipboard(r.accountNumber)}
                            title="Copy Account Number"
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Clipboard className="w-4 h-4 text-gray-600" />
                          </button>
                        </td>
                        <td className="px-2 py-1">{r.idNumber || "N/A"}</td>
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
