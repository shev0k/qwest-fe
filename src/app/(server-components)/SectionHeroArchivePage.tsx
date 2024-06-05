"use client";
import React, { FC, useEffect, useState, useCallback } from "react";
import imagePng from "@/images/hero-right2.png";
import HeroSearchForm, { SearchTab } from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image, { StaticImageData } from "next/image";
import { useSearchParams } from "next/navigation";
import { GuestsObject } from "../(client-components)/(HeroSearchForm)/GuestsInput";

export interface SectionHeroArchivePageProps {
  className?: string;
  listingType?: React.ReactNode;
  currentPage: "Stays";
  currentTab: SearchTab;
  rightImage?: StaticImageData;
  onSearch: (location: string, dates: [Date | null, Date | null], guests: GuestsObject) => void;
  numListings: number;
}

const SectionHeroArchivePage: FC<SectionHeroArchivePageProps> = ({
  className = "",
  listingType,
  currentPage,
  currentTab,
  rightImage = imagePng,
  onSearch,
  numListings,
}) => {
  const searchParams = useSearchParams();
  const [searchParamsState, setSearchParamsState] = useState({
    location: searchParams.get("location") || "",
    dates: [
      searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : null,
      searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null,
    ] as [Date | null, Date | null],
    guests: {
      guestAdults: parseInt(searchParams.get("guestAdults") || "1", 10),
      guestChildren: parseInt(searchParams.get("guestChildren") || "0", 10),
      guestInfants: parseInt(searchParams.get("guestInfants") || "0", 10),
    } as GuestsObject,
  });

  // Using useCallback to memoize handleSearch and avoid re-creating it on every render
  const handleSearch = useCallback(
    (location: string, dates: [Date | null, Date | null], guests: GuestsObject) => {
      setSearchParamsState({ location, dates, guests });
      onSearch(location, dates, guests);
    },
    [onSearch] // Depend only on onSearch to avoid re-renders
  );

  useEffect(() => {
    const { location, dates, guests } = searchParamsState;
    if (location || dates[0] || guests.guestAdults !== 1 || guests.guestChildren !== 0 || guests.guestInfants !== 0) {
      onSearch(location, dates, guests);
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className={`nc-SectionHeroArchivePage flex flex-col relative ${className}`} data-nc-id="SectionHeroArchivePage">
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-6 lg:space-y-10 pb-14 lg:pb-64 xl:pb-80 xl:pr-14 lg:mr-10 xl:mr-0">
          <h2 className="font-medium text-4xl md:text-5xl xl:text-7xl leading-[110%]">
            {searchParamsState.location || "All Countries"}
          </h2>
          <div className="flex items-center text-base md:text-lg text-neutral-500 dark:text-neutral-400">
            <i className="text-2xl las la-map-marked"></i>
            <span className="ml-2.5">{searchParamsState.location || "All Countries"}</span>
            <span className="mx-5"></span>
            {listingType ? (
              listingType
            ) : (
              <>
                <i className="text-2xl las la-home"></i>
                <span className="ml-2.5">
                  {numListings === 0 ? "No Stays" : `${numListings} ${numListings === 1 ? "Stay" : "Stays"}`}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex-grow">
          <Image className="w-full" src={rightImage} alt="hero" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw" />
        </div>
      </div>

      <div className="hidden lg:flow-root w-full">
        <div className="z-10 lg:-mt-40 xl:-mt-56 w-full">
          <HeroSearchForm currentPage={currentPage} currentTab={currentTab} onSearch={handleSearch} initialLocation={searchParamsState.location} initialDates={searchParamsState.dates} initialGuests={searchParamsState.guests} />
        </div>
      </div>
    </div>
  );
};

export default SectionHeroArchivePage;
