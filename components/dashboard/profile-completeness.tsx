// "use client";

// import { useState, useEffect } from "react";
// import { db } from "@/lib/firebase";
// import { doc, onSnapshot, updateDoc } from "firebase/firestore";
// import { auth } from "@/lib/firebase";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import { Switch } from "@/components/ui/switch"; // adjust this if you're not using shadcn
// import { cn } from "@/lib/utils";
// import { FaRegCircleCheck } from "react-icons/fa6";

// interface ProfileItem {
//   key: keyof ProfileStatus;
//   label: string;
//   color: string;
// }

// interface ProfileStatus {
//   emailAdded: boolean;
//   mobileAdded: boolean;
//   cardAdded: boolean;
//   bankLinked: boolean;
// }

// interface Props {
//   userId?: string;
//   isAdminView?: boolean;
// }

// const profileItems: ProfileItem[] = [
//   { key: "emailAdded", label: "Email Added", color: "#2557ec" },
//   { key: "mobileAdded", label: "Mobile Number Added", color: "#4a91a7" },
//   { key: "cardAdded", label: "Card Added", color: "#0d042c" },
//   { key: "bankLinked", label: "Bank Account Linked", color: "#fef08a" },
// ];

// export const ProfileCompleteness = ({ userId, isAdminView = false }: Props) => {
//   const [status, setStatus] = useState<ProfileStatus | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const uid = userId || auth.currentUser?.uid;
//     if (!uid) return;

//     const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
//       const data = snap.data() as any;
//       setStatus({
//         emailAdded: true,
//         mobileAdded: true,
//         cardAdded: !!data?.cardAdded,
//         bankLinked: !!data?.bankLinked,
//       });
//       setLoading(false);
//     });

//     return () => unsub();
//   }, [userId]);

//   const handleToggle = async (key: keyof ProfileStatus, value: boolean) => {
//     if (!userId) return;
//     await updateDoc(doc(db, "users", userId), {
//       [key]: value,
//     });
//   };

//   if (loading || !status)
//     return (
//       <div className="text-sm text-gray-400 mt-3">
//         Loading profile completeness...
//       </div>
//     );

//   const completedCount = Object.values(status).filter(Boolean).length;
//   const completionPercentage = (completedCount / profileItems.length) * 100;

//   return (
//     <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 space-y-4 text-sm text-white mt-4 font-montserrat">
//       <h3 className="text-lg font-bold">Profile Completeness</h3>

//       <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
//         <div
//           className="bg-green-400 h-full transition-all duration-300"
//           style={{ width: `${completionPercentage}%` }}
//         />
//       </div>

//       <ul className="space-x-2 gap-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
//         {profileItems.map((item) => (
//           <li
//             key={item.key}
//             className={`flex items-center font-semibold h-24 rounded text-center justify-center w-full`}
//             style={{ backgroundColor: item.color }}
//           >
//             <span
//               className={cn(
//                 "flex items-center gap-2 text-center justify-center",
//                 item.label === "Bank Account Linked" && "text-black"
//               )}
//             >
//               {status[item.key] ? (
//                 <FaRegCircleCheck className="text-green-400 text-lg" />
//               ) : (
//                 <FaTimesCircle className="text-red-400 text-lg" />
//               )}
//               {item.label}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Switch } from "@/components/ui/switch"; // adjust this if you're not using shadcn
import { cn } from "@/lib/utils";
import { FaRegCircleCheck } from "react-icons/fa6";

interface ProfileItem {
  key: keyof ProfileStatus;
  label: string;
  color: string;
}

interface ProfileStatus {
  emailAdded: boolean;
  mobileAdded: boolean;
  cardAdded: boolean;
  bankLinked: boolean;
}

interface Props {
  userId?: string;
  isAdminView?: boolean;
}

const profileItems: ProfileItem[] = [
  { key: "emailAdded", label: "Email Added", color: "#2557ec" },
  { key: "mobileAdded", label: "Mobile Number Added", color: "#4a91a7" },
  { key: "cardAdded", label: "Card Added", color: "#0d042c" },
  { key: "bankLinked", label: "Bank Account Linked", color: "#fef08a" },
];

export const ProfileCompleteness = ({ userId, isAdminView = false }: Props) => {
  const [status, setStatus] = useState<ProfileStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) return;

    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      const data = snap.data() as any;
      setStatus({
        emailAdded: true,
        mobileAdded: true,
        cardAdded: !!data?.cardAdded,
        bankLinked: !!data?.bankLinked,
      });
      setLoading(false);
    });

    return () => unsub();
  }, [userId]);

  const handleToggle = async (key: keyof ProfileStatus, value: boolean) => {
    if (!userId) return;
    await updateDoc(doc(db, "users", userId), {
      [key]: value,
    });
  };

  if (loading || !status)
    return (
      <div className="text-sm text-gray-400 mt-3 sm:mt-4">
        Loading profile completeness...
      </div>
    );

  const completedCount = Object.values(status).filter(Boolean).length;
  const completionPercentage = (completedCount / profileItems.length) * 100;

  return (
    <div className="bg-transparent backdrop-blur-0 border border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 text-sm sm:text-base text-white mt-4 font-montserrat">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
        Profile Completeness
      </h3>

      <div className="w-full bg-gray-700 h-1.5 sm:h-2 rounded-full overflow-hidden">
        <div
          className="bg-green-400 h-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {profileItems.map((item) => (
          <li
            key={item.key}
            className="flex items-center justify-center h-16 sm:h-20 lg:h-24 w-full rounded-lg text-center"
            style={{ backgroundColor: item.color }}
          >
            <span
              className={cn(
                "flex items-center gap-1 sm:gap-2 text-center justify-center text-xs sm:text-sm lg:text-base",
                item.label === "Bank Account Linked" && "text-black"
              )}
            >
              {status[item.key] ? (
                <FaRegCircleCheck className="text-green-400 text-base sm:text-lg lg:text-xl" />
              ) : (
                <FaTimesCircle className="text-red-400 text-base sm:text-lg lg:text-xl" />
              )}
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
