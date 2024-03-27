"use client";
import React, { FC, ReactNode, useState, useEffect } from "react";
import { StayDataType } from "@/data/types";
import ButtonPrimary from "@/shared/ButtonPrimary";
import HeaderFilter from "./HeaderFilter";
import StayCard from "./StayCard";
import StayCard2 from "./StayCard2";
import fetchStayListings from "../api/stayListingsService"; // Adjust the import path as necessary

export interface SectionGridFeaturePlacesProps {
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
  cardType?: "card1" | "card2";
}

const SectionGridFeaturePlaces: FC<SectionGridFeaturePlacesProps> = ({
  gridClass = "",
  heading = "Highlighted Stays",
  subHeading = "Picks for Lodging Recommended by QWEST",
  headingIsCenter,
  tabs = ["Japan", "Romania", "France", "England", "Netherlands"],
  cardType = "card2",
}) => {
  const [stayListings, setStayListings] = useState<StayDataType[]>([]);

  useEffect(() => {
    const loadStayListings = async () => {
      try {
        const listings = await fetchStayListings();
        setStayListings(listings);
      } catch (error) {
        console.error("Failed to fetch stay listings", error);
      }
    };

    loadStayListings();
  }, []);

  const renderCard = (stay: StayDataType) => {
    switch (cardType) {
      case "card1":
        return <StayCard key={stay.id} data={stay} />;
      case "card2":
        return <StayCard2 key={stay.id} data={stay} />;
      default:
        return <StayCard key={stay.id} data={stay} />;
    }
  };
  

  return (
    <div className="nc-SectionGridFeaturePlaces relative">
      <HeaderFilter
        tabActive={"Japan"}
        subHeading={subHeading}
        tabs={tabs}
        heading={heading}
      />
      <div
        className={`grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
      >
        {stayListings.map(renderCard)}
      </div>
      <div className="flex mt-16 justify-center items-center">
        <ButtonPrimary>Show More</ButtonPrimary> {/* Removed loading prop for simplicity */}
      </div>
    </div>
  );
};

export default SectionGridFeaturePlaces;
