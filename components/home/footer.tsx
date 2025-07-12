import React from "react";
import { InputWithButton } from "./emailForm";

const Footer = () => {
  return (
    <footer className="mt-52 bg-gradient-to-r from-[#141d21] via-[#050b13] to-[#081228] border-t border-slate-600 text-white font-montserrat">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-10 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-b-slate-700">
        {/* Logo & Description */}
        <div className="space-y-4">
          {/* <img
            src="/logo.png"
            alt="NexxaPay Logo"
            className="h-12 sm:h-14 md:h-16 w-auto"
          /> */}
          <p className="text-2xl font-montserrat">NexxaPay</p>
          <p className="text-sm sm:text-base text-slate-300">
            We provide a secure and efficient platform for all your online
            transactions. Trust NexxaPay to handle your payments with ease.
          </p>
        </div>

        {/* Contact Us */}
        <div className="space-y-4">
          <p className="text-base sm:text-lg font-semibold border-l-4 border-[#36bb91] pl-3">
            Contact Us
          </p>
          <div className="space-y-2 text-slate-300 text-sm sm:text-base">
            <p>202 Helga Springs Rd, Crawford, TN 38554</p>
            <a href="mailto:support@nexxapay.com" className="hover:underline">
              support@nexxapay.com
            </a>
          </div>
        </div>

        {/* Email Updates */}
        <div className="space-y-4">
          <p className="text-base sm:text-lg font-semibold border-l-4 border-[#36bb91] pl-3">
            Sign Up for Email Updates
          </p>
          <div className="w-full sm:w-[80%]">
            <InputWithButton />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-6 text-center text-slate-400 text-sm sm:text-base">
        © 2025 NexxaPay. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
