"use client";
import React, { FC, ReactNode, useState, useEffect } from "react";
import { StayDataType } from "@/data/types";
import ButtonPrimary from "@/shared/ButtonPrimary";
import HeaderFilter from "./HeaderFilter";
import StayCard from "./StayCard";
import StayCard2 from "./StayCard2";
import { fetchStayListingsWithQuery, buildQuery } from "@/api/stayListingsService"; // Adjust the import path as necessary

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
  tabs = ["Netherlands", "Japan", "Romania", "France", "England"],
  cardType = "card2",
}) => {
  const [stayListings, setStayListings] = useState<{ [key: string]: StayDataType[] }>({});
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [page, setPage] = useState<{ [key: string]: number }>({});
  const [hasMore, setHasMore] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const fetchListings = async (tab: string, page: number, append = false) => {
    setLoading(true);
    try {
      const query = buildQuery({
        location: tab,
        page,
        limit: 6,
      });

      const listings = await fetchStayListingsWithQuery(query);

      setStayListings((prevListings) => ({
        ...prevListings,
        [tab]: append ? [...(prevListings[tab] || []), ...listings] : listings,
      }));

      setHasMore((prevHasMore) => ({
        ...prevHasMore,
        [tab]: listings.length === 6,
      }));

      setPage((prevPage) => ({
        ...prevPage,
        [tab]: page,
      }));
    } catch (error) {
      console.error("Failed to fetch stay listings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!stayListings[activeTab]) {
      fetchListings(activeTab, 0);
    }
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleShowMore = () => {
    const nextPage = (page[activeTab] || 0) + 1;
    fetchListings(activeTab, nextPage, true);
  };

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

  const filteredListings = stayListings[activeTab] || [];

  return (
    <div className="nc-SectionGridFeaturePlaces relative">
      <HeaderFilter
        tabActive={activeTab}
        subHeading={subHeading}
        tabs={tabs}
        heading={heading}
        onClickTab={handleTabChange}
      />
      {filteredListings.length ? (
        <div
          className={`grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
        >
          {filteredListings.map(renderCard)}
        </div>
      ) : (
        !loading && (
          <div className="text-neutral-500 dark:text-neutral-400 mt-8">
            No listings were found at the selected location.
          </div>
        )
      )}
      {hasMore[activeTab] && (
        <div className="flex mt-16 justify-center items-center">
          <ButtonPrimary onClick={handleShowMore}>Show More</ButtonPrimary>
        </div>
      )}
    </div>
  );
};

export default SectionGridFeaturePlaces;
