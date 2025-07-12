// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import React from "react";

// const accordion = () => {
//   const faqs = [
//     {
//       question: "What is YieldFountain?",
//       answer:
//         "YieldFountain is an AI based company specialized in investment of digital assets, agro and real estate investments.",
//     },
//     {
//       question: "How can I invest?",
//       answer:
//         "Simply create a free account and choose an investment plan from your dashboard.",
//     },
//     {
//       question: "How much can I invest?",
//       answer: "Users can invest as low as $50 from their investment dashboard.",
//     },
//     {
//       question: "What is YieldFountain Token?",
//       answer:
//         "YieldFountain token is the governance token of the YieldFountain Company. it is tradable directly from your dashboard.",
//     },
//     {
//       question: "How can I withdraw?",
//       answer:
//         "You can withdraw your returns once your investment plan expires.",
//     },
//     {
//       question: "How do I get more help?",
//       answer:
//         "You can chat with our agents via our live chats, or sent and email to support@yieldfountain.com",
//     },
//   ];
//   return (
//     <Accordion
//       type="single"
//       collapsible
//       className="grid md:grid-cols-2 gap-y-10 gap-x-10"
//     >
//       <div className=" gap-x-10 space-y-8 font-montserrat">
//         {faqs.slice(0, 3).map((item, index) => (
//           <AccordionItem
//             value={item.question}
//             key={index}
//             className="border-slate-700"
//           >
//             <AccordionTrigger className="text-white">
//               <p className="text-white text-base sm:text-lg ">
//                 {item.question}
//               </p>
//             </AccordionTrigger>
//             <AccordionContent>
//               <p className="text-slate-400 text-sm sm:text-base">
//                 {item.answer}
//               </p>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </div>
//       <div className=" gap-x-10 space-y-8 font-montserrat">
//         {/* faq column 2 */}
//         {faqs.slice(3, 6).map((item, index) => (
//           <AccordionItem
//             value={item.question}
//             key={index}
//             className="border-slate-700"
//           >
//             <AccordionTrigger className="text-white">
//               <p className="text-white text-base sm:text-lg ">
//                 {item.question}
//               </p>
//             </AccordionTrigger>
//             <AccordionContent>
//               <p className="text-slate-400 text-base sm:text-lg ">
//                 {item.answer}
//               </p>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </div>
//     </Accordion>
//   );
// };

// export default accordion;

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is NexxaPay?",
      answer:
        "NexxaPay is an online transaction platform specializing in secure and fast payments, transfers, and financial services.",
    },
    {
      question: "How can I start transferring?",
      answer:
        "Simply create a free account and select your transfer options from your dashboard.",
    },
    {
      question: "How much can I transfer?",
      answer: "You can transfer as low as $10 through your NexxaPay dashboard.",
    },
    {
      question: "What is NexxaPay Token?",
      answer:
        "NexxaPay Token is the utility token for the NexxaPay platform, usable for transactions and available directly from your dashboard.",
    },
    {
      question: "How can I withdraw?",
      answer:
        "You can withdraw your funds instantly after initiating a transfer request.",
    },
    {
      question: "How do I get more help?",
      answer:
        "You can chat with our agents via our live chats, or send an email to support@nexxapay.com",
    },
  ];
  return (
    <Accordion
      type="single"
      collapsible
      className="grid md:grid-cols-2 gap-y-10 gap-x-10"
    >
      <div className=" gap-x-10 space-y-8 font-montserrat">
        {faqs.slice(0, 3).map((item, index) => (
          <AccordionItem
            value={item.question}
            key={index}
            className="border-slate-700"
          >
            <AccordionTrigger className="text-white">
              <p className="text-white text-base sm:text-lg ">
                {item.question}
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-slate-400 text-sm sm:text-base">
                {item.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </div>
      <div className=" gap-x-10 space-y-8 font-montserrat">
        {/* faq column 2 */}
        {faqs.slice(3, 6).map((item, index) => (
          <AccordionItem
            value={item.question}
            key={index}
            className="border-slate-700"
          >
            <AccordionTrigger className="text-white">
              <p className="text-white text-base sm:text-lg ">
                {item.question}
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-slate-400 text-base sm:text-lg ">
                {item.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </div>
    </Accordion>
  );
};

export default FAQ;
