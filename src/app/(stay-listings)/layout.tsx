"use client";
import BackgroundSection from "@/components/BackgroundSection";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import React, { ReactNode, useState, useEffect } from "react";
import SectionHeroArchivePage from "../(server-components)/SectionHeroArchivePage";
import SectionGridFilterCard from "@/app/(stay-listings)/SectionGridFilterCard";
import { GuestsObject } from "../(client-components)/(HeroSearchForm)/GuestsInput";
import { useSearchParams } from "next/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useState({
    location: "",
    dates: [null, null] as [Date | null, Date | null],
    guests: { guestAdults: 1, guestChildren: 0, guestInfants: 0 } as GuestsObject,
  });
  const [numListings, setNumListings] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const searchParamsFromURL = useSearchParams();
  useEffect(() => {
    if (initialLoad) {
      const location = searchParamsFromURL.get("location") || "";
      const startDate = searchParamsFromURL.get("startDate") ? new Date(searchParamsFromURL.get("startDate")!) : null;
      const endDate = searchParamsFromURL.get("endDate") ? new Date(searchParamsFromURL.get("endDate")!) : null;
      const guests = {
        guestAdults: parseInt(searchParamsFromURL.get("guestAdults") || "1", 10),
        guestChildren: parseInt(searchParamsFromURL.get("guestChildren") || "0", 10),
        guestInfants: parseInt(searchParamsFromURL.get("guestInfants") || "0", 10),
      } as GuestsObject;

      setSearchParams({ location, dates: [startDate, endDate], guests });
      setInitialLoad(false);
    }
  }, [initialLoad, searchParamsFromURL]);

  const handleSearch = (location: string, dates: [Date | null, Date | null], guests: GuestsObject) => {
    setSearchParams({ location, dates, guests });
  };

  const handleListingsFetched = (numListings: number) => {
    setNumListings(numListings);
  };

  const totalGuests = searchParams.guests.guestAdults + searchParams.guests.guestChildren + searchParams.guests.guestInfants;

  return (
    <div className={`nc-ListingStayPage relative`}>
      <BgGlassmorphism />

      <div className="container pt-10 pb-24 lg:pt-16 lg:pb-28">
        <SectionHeroArchivePage
          currentPage="Stays"
          currentTab="Stays"
          onSearch={handleSearch}
          numListings={numListings}
        />
      </div>

      <div className="container pb-24 lg:pb-28">
        <SectionGridFilterCard
          location={searchParams.location}
          dates={searchParams.dates}
          guests={totalGuests}
          onListingsFetched={handleListingsFetched}
        />
      </div>

      {children}

      <div className="container overflow-hidden">
        <div className="relative py-16 mb-24 lg:mb-28">
          <BackgroundSection />
          <SectionSliderNewCategories
            heading="Explore by Types of Stays"
            subHeading="Explore Stays Based on 4 Types of Stays"
            categoryCardType="card5"
            itemPerRow={4}
            sliderStyle="style2"
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;
