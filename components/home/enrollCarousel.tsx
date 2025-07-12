"use client";
import React, { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";

interface EnrollCarouselProps {
  activeSlide: number;
}

const EnrollCarousel = ({ activeSlide }: EnrollCarouselProps) => {
  const [emblaRef, embla] = useEmblaCarousel();

  useEffect(() => {
    if (embla) {
      embla.scrollTo(activeSlide);
    }
  }, [activeSlide, embla]);

  const slides = [
    {
      img: "open-account.png",
      title: "Create a free account",
      writeup:
        "Follow our simple signup process and create a free account to start your online transfers. Ensure all details are accurate for a smooth experience",
      button: "Open Account",
    },
    {
      img: "add-funds.png",
      title: "Add funds to your account",
      writeup:
        "Log into your dashboard and add funds to your account to enable seamless online transfers",
      button: "Join now",
    },
    {
      img: "choose-plan.png",
      title: "Select your transfer options",
      writeup:
        "NexxaPay offers flexible transfer options for every need. Choose the option that suits you and start transferring instantly",
      button: "Sign up",
    },
    {
      img: "sit-back.png",
      title: "Enjoy instant transfers",
      writeup:
        "With NexxaPay, your transfers are processed quickly and securely. Sit back and manage your transactions with ease",
      button: "Open account",
    },
  ];

  return (
    <div className="overflow-hidden mt-14" ref={emblaRef}>
      <div className="flex">
        {slides.map((item, index) => (
          <div
            key={index}
            className="flex-none w-full flex-shrink-0  px-2.5 md:px-24"
          >
            <div className="h-full bg-[#04182e] rounded-xl flex px-4 md:px-10 gap-x-4 md:gap-x-10 items-center py-8">
              <img
                src={item.img}
                alt=""
                className="w-1/4 md:w-auto md:h-96 object-contain md:ml-10"
              />
              <div className="text-slate-300 font-montserrat">
                <p className="text-3xl font-semibold">{item.title}</p>
                <p className="text-sm sm:text-base mt-2">{item.writeup}</p>
                <Link
                  href="/auth"
                  className="mt-5 flex underline text-[#6cdef5] font-semibold text-lg"
                >
                  {item.button}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrollCarousel;
