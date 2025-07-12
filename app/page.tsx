"use client";
import React from "react";
import Sidebar from "@/components/home/sidebar";
import { motion } from "framer-motion";
import useOnScreen from "@/hooks/scroll";
import { variant } from "@/hooks/variant";
import { useEffect, useState } from "react";
import Nav from "@/components/fixedNav";
import Nav1 from "@/components/nav1";
import "@/styles/star-background.css";
import EnrollCarousel from "@/components/home/enrollCarousel";
import { FaStar } from "react-icons/fa6";
import FAQ from "@/components/home/accordion";
import Link from "next/link";
import Footer from "@/components/home/footer";
import { MarketCarousel } from "@/components/marketsCarousel/carousel";
import WithdrawalPopup from "@/components/withdrawals-popup/popup";
import { withrawals } from "@/lib/data";

export default function HomePage() {
  const [ref1, isvisible1] = useOnScreen({ threshold: 0.1 });
  const [active, setActive] = useState("Open Account");
  const buttons = ["Open Account", "Deposit", "Transfer", "Save"];
  const slideIndex = buttons.indexOf(active);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const randomPerson =
        withrawals[Math.floor(Math.random() * withrawals.length)].name;
      const randomAmount =
        Math.floor(Math.random() * (120000 - 5000 + 1)) + 5000;
      const formattedAmount = `$${randomAmount.toLocaleString()}`;
      setPopupMessage(`${randomPerson} just transferred ${formattedAmount}`);
      setPopupVisible(true);

      setTimeout(() => {
        setPopupVisible(false);
      }, 4000); // Show for 4 seconds
    }, 18000); // Every 25 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <main className="bg-black overflow-x-hidden font-montserrat relative z-20">
        <div className=" z-0 relative">
          <div className="stars small"></div>
          <div className="stars medium"></div>
          <div className="stars large"></div>
        </div>
        {/*Navs  */}
        <Nav />
        <Nav1 />
        {/* hero */}
        <div
          className="text-white font-montserrat min-h-screen md:min-h-[75vh] grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-16 px-6 md:px-20 py-20 z-20 relative"
          id="home"
        >
          <div className="flex flex-col justify-center space-y-7 pt-10 md:pt-0 sm:space-y-8 max-w-xl mx-auto sm:mx-0">
            <p className="text-[#36bb91] text-lg sm:text-2xl font-bold font-montserrat tracking-wide uppercase">
              YOUR TRUSTED ONLINE TRANSACTION SOLUTION
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight">
              Secure <br /> Payments Made Simple
            </h1>

            <Link
              href="/auth"
              className="inline-block mt-12 px-12 py-4 rounded-lg bg-gradient-to-r from-[#36bb91] to-[#369cbb] font-montserrat text-xl font-semibold text-white uppercase shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              Open Account
            </Link>
          </div>

          {/* Image box */}
          <div className="flex justify-center items-center sm:w-2/3 mx-auto ">
            <motion.div
              // @ts-ignore
              ref={ref1}
              initial="hidden"
              animate={isvisible1 ? "visible" : "hidden"}
              variants={variant}
              transition={{ duration: 1 }}
              className="w-full max-w-sm sm:max-w-md"
            >
              <img
                src="/box.png"
                alt="Transaction Vault"
                className="w-full object-contain"
              />
            </motion.div>
          </div>
        </div>
        {/* Partners Section */}
        <div className="mt-20 md:mt-40 px-6 md:px-20 z-20 relative">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center justify-items-center">
            {[
              { src: "visa.png", alt: "Visa Logo" },
              { src: "mastercard.png", alt: "Mastercard Logo" },
              { src: "paypal.png", alt: "Paypal Logo" },
            ].map((partner, index) => (
              <div key={index} className="w-full flex justify-center">
                <img
                  src={partner.src}
                  alt={partner.alt}
                  className="h-10 sm:h-12 object-contain opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Stats + About Section */}
        <div className="pt-24 text-white z-20 relative">
          <div className="px-4 md:px-20">
            {/* Divider */}
            <hr className="border-slate-700" />

            {/* Numbers grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 text-center py-12 gap-8">
              {[
                { label: "ACTIVE ACCOUNTS", value: "12k+" },
                { label: "TOTAL TRANSACTIONS", value: "$115M" },
                { label: "CUSTOMER RATING", value: "4.8" },
                { label: "TRANSACTIONS DAILY", value: "90M+" },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-4xl font-bold">{item.value}</p>
                  <p className="text-sm font-medium text-slate-300 mt-1">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* About Section */}
            <div
              className="text-white font-montserrat text-center py-10"
              id="about"
            >
              <p className="text-[#36bb91] text-lg font-semibold uppercase tracking-wide">
                About NexxaPay
              </p>
              <h2 className="text-4xl sm:text-5xl font-semibold leading-snug mt-4 sm:w-2/3 mx-auto">
                Your Money, Our Priority
              </h2>
              <p className="text-slate-400 text-lg mt-4 sm:w-2/3 mx-auto">
                NexxaPay offers a seamless and secure online transaction
                experience, designed for convenience and trust.
              </p>
            </div>

            {/* Graphic + Cards */}
            <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
              {/* Left: Chart image */}
              <div className="px-4 flex flex-col items-center justify-center">
                <img
                  src="/banking.jpg"
                  alt="Transaction App Interface"
                  className="w-full md:w-2/3 rounded-lg shadow-xl"
                />
              </div>

              {/* Right: Feature cards */}
              <div className="space-y-6">
                {[
                  {
                    img: "/mobile.png",
                    name: "Mobile Transactions",
                    writeup:
                      "NexxaPay provides a user-friendly mobile app, allowing you to manage your transactions anytime, anywhere.",
                  },
                  {
                    img: "/security.png",
                    name: "Advanced Security",
                    writeup:
                      "With cutting-edge encryption and a dedicated cybersecurity team, your funds and data are always protected.",
                  },
                  {
                    img: "/savings.png",
                    name: "Payments & Transfers",
                    writeup:
                      "Enjoy fast payments and instant transfers, designed for your financial flexibility and convenience.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-b from-[#1f2a38] to-[#0f1620] rounded-xl px-6 py-6 flex items-start gap-5 shadow-md"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-12 w-12 object-contain"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-[#6cdef5]">
                        {item.name}
                      </h3>
                      <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                        {item.writeup}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* HOW IT WORKS */}
        <div
          className="pt-36 font-montserrat px-4 sm:px-10 md:px-20 z-20 relative"
          id="how-it-works"
        >
          <p className="text-[#2bbda4] text-xl sm:text-2xl font-semibold text-center">
            HOW IT WORKS
          </p>
          <h2 className="text-3xl sm:text-4xl text-center text-white font-semibold mt-6">
            Start Transacting with NexxaPay
          </h2>
          <p className="text-base sm:text-lg text-center text-white mt-4 sm:w-2/3 mx-auto leading-relaxed">
            We've simplified the process to help you start transacting with ease
            and confidence.
          </p>

          {/* Toggle Buttons */}
          <div className="bg-[#334152] w-full sm:w-[80%] lg:w-1/2 mx-auto rounded-full mt-10 flex items-center justify-between px-3 py-2 gap-2">
            {buttons.map((label) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`text-sm sm:text-base flex-1 rounded-full py-3 font-semibold transition-all duration-300
          ${
            active === label
              ? "bg-[#6366ff] text-white shadow"
              : "text-slate-200 hover:bg-[#445266]"
          }
        `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Carousel */}
          <div className="mt-10">
            <EnrollCarousel activeSlide={slideIndex} />
          </div>
        </div>
        {/* OUR TEAM */}
        <div
          className="pt-40 font-montserrat px-4 sm:px-10 md:px-20 z-20 relative"
          id="team"
        >
          <p className="text-[#2bbda4] text-xl sm:text-2xl font-semibold text-center">
            OUR TEAM
          </p>
          <h2 className="text-4xl sm:text-5xl text-center pt-4 text-white font-semibold leading-tight">
            Meet Our Transaction Experts
          </h2>

          {/* Team Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 pt-14">
            {[
              {
                image: "/evelyn.jpg",
                name: "Evelyn Jones",
                position: "Compliance Officer",
              },
              {
                image: "/lucia.jpg",
                name: "Lucia Chicago",
                position: "CEO",
              },
              {
                image: "/roberts.jpg",
                name: "Roberts Florian",
                position: "Financial Analyst",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-[#14253b] hover:bg-[#1a304e] transition-all duration-300 rounded-2xl shadow-lg overflow-hidden p-6 flex flex-col items-center text-center group hover:shadow-2xl"
              >
                <div className="w-40 h-40 sm:w-48 sm:h-48 overflow-hidden rounded-full border-4 border-[#2bbda4]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-2xl font-semibold text-white mt-6">
                  {member.name}
                </p>
                <p className="text-slate-400 text-base mt-1">
                  {member.position}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Reviews Introduction */}
        <div className="pt-48 grid md:grid-cols-2 font-montserrat px-6 sm:px-10 md:px-20 items-center gap-y-12 gap-x-10 z-20 relative">
          <div className="space-y-5 sm:space-y-4 text-center md:text-left">
            <p className="text-[#2bbda4] text-2xl sm:text-3xl font-semibold">
              Reviews
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-snug">
              Trusted by Millions Worldwide
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 font-medium">
              Join our community of satisfied transaction customers.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src="/coins.png"
              alt="Happy customers"
              className="w-3/4 sm:w-2/3 max-w-[400px] object-contain"
            />
          </div>
        </div>
        {/* Reviews Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 px-6 sm:px-10 md:px-20 pt-14 gap-8 z-20 relative">
          {[
            {
              name: "Adam Watson",
              position: "Customer",
              review:
                "“NexxaPay makes transactions so easy! Their app is fantastic, and I feel secure with every payment.”",
              img: "adam.jpg",
            },
            {
              name: "Lisa Smith",
              position: "Business Owner",
              review:
                "“I highly recommend NexxaPay for anyone looking for reliable and user-friendly transaction services.”",
              img: "lisa.jpg",
            },
            {
              name: "Nicole Green",
              position: "Customer",
              review:
                "“The best transaction experience I’ve had. NexxaPay’s support team is amazing, and transfers are instant!”",
              img: "nicole.jpg",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-[#14253b] hover:bg-[#1a304e] transition-all duration-300 rounded-xl p-8 shadow-lg font-montserrat flex flex-col justify-between"
            >
              {/* Stars */}
              <div className="flex text-yellow-400 text-xl gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <FaStar key={i} />
                  ))}
              </div>

              {/* Review Text */}
              <p className="text-lg text-slate-300 mt-6 flex-grow leading-relaxed">
                {item.review}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center mt-6">
                <div>
                  <p className="text-white text-lg font-semibold">
                    {item.name}
                  </p>
                  <p className="text-slate-400 text-sm">{item.position}</p>
                </div>
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        {/* FAQ */}
        <div
          className="pt-48 font-m px-6 sm:px-10 md:px-20 z-20 relative"
          id="faq"
        >
          {/* Section Heading */}
          <div className="text-center space-y-3">
            <p className="text-[#2bbda4] text-2xl sm:text-3xl font-semibold font-montserrat">
              FAQ
            </p>
            <h2 className="text-4xl sm:text-5xl text-white font-semibold">
              Still have questions?
            </h2>
            <p className="text-lg sm:text-xl text-slate-400">
              See frequently asked questions by our customers
            </p>
          </div>

          {/* Accordion */}
          <div className="w-full pt-12">
            <FAQ />
          </div>

          {/* CTA */}
          <div className="bg-[#0b1c30] py-10 sm:py-20 px-6 sm:px-12 mt-28 sm:mt-20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left font-montserrat space-y-4">
              <p className="text-white text-xl sm:text-2xl font-semibold">
                Ready to start transacting with NexxaPay?
              </p>
              <p className="text-sm sm:text-base text-slate-400 font-medium">
                Open an account now and experience seamless transactions.
              </p>
            </div>

            <Link
              href=""
              className="mt-4 sm:mt-0 bg-gradient-to-r from-[#36bb91] to-[#369cbb] text-white text-lg sm:text-xl font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Sign up
            </Link>
          </div>
        </div>
        <div className="z-20 relative">
          <Footer />
        </div>
        <WithdrawalPopup message={popupMessage} visible={popupVisible} />
      </main>
    </>
  );
}
