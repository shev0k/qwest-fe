"use client";
import React, { FC } from "react";
import imagePng from "@/images/hero-right.png";
import HeroSearchForm from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image from "next/image";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { useRouter } from "next/navigation";
import { GuestsObject } from "../(client-components)/(HeroSearchForm)/GuestsInput";

export interface SectionHeroProps {
  className?: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = "" }) => {
  const router = useRouter();

  const handleSearch = (location: string, dates: [Date | null, Date | null], guests: GuestsObject) => {
    const [startDate, endDate] = dates;
    const totalGuests = guests.guestAdults + guests.guestChildren + guests.guestInfants;
    const searchParams = new URLSearchParams({
      location,
      startDate: startDate ? startDate.toISOString() : "",
      endDate: endDate ? endDate.toISOString() : "",
      guests: totalGuests.toString(),
      guestAdults: guests.guestAdults.toString(),
      guestChildren: guests.guestChildren.toString(),
      guestInfants: guests.guestInfants.toString(),
    }).toString();

    router.push(`/listing-stay?${searchParams}`);
  };

  return (
    <div className={`nc-SectionHero flex flex-col-reverse lg:flex-col relative ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 pb-14 lg:pb-64 xl:pr-14 lg:mr-10 xl:mr-0">
          <h2 className="font-medium text-4xl md:text-5xl xl:text-7xl !leading-[114%] ">
            Stays, Calm Experiences
          </h2>
          <span className="text-base md:text-lg text-neutral-500 dark:text-neutral-400">
            Embark on a journey brimming with experiences. With QWEST, secure your bookings for accommodations, resort villas, and hotels seamlessly.
          </span>
          <ButtonPrimary href="/listing-stay" sizeClass="px-5 py-4 sm:px-7">
            Begin Your Exploration
          </ButtonPrimary>
        </div>
        <div className="flex-grow">
          <Image className="w-full" src={imagePng} alt="hero" priority />
        </div>
      </div>

      <div className="hidden lg:block z-10 mb-12 lg:mb-0 lg:-mt-40 w-full">
        <HeroSearchForm onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default SectionHero;
