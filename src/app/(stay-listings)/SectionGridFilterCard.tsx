"use client";
import React, { FC, useEffect, useState } from "react";
import { StayDataType } from "@/data/types";
import ButtonPrimary from "@/shared/ButtonPrimary";
import TabFilters from "./TabFilters";
import Heading2 from "@/shared/Heading2";
import StayCard2 from "@/components/StayCard2";
import { fetchStayListingsWithQuery, buildQuery, formatDate } from "@/api/stayListingsService";
import { useSearchParams } from "next/navigation";

export interface SectionGridFilterCardProps {
  className?: string;
  location?: string;
  dates?: [Date | null, Date | null];
  guests?: number;
  onListingsFetched?: (numListings: number) => void;
}

interface FiltersType {
  typeOfStay: string[];
  priceRange: [number, number];
  rooms: {
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  amenities: number[];
  propertyType: string[];
}

const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
  return date >= startDate && date <= endDate;
};

const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
  location = "",
  dates = [null, null],
  guests = 1,
  onListingsFetched,
}) => {
  const [stayListings, setStayListings] = useState<StayDataType[]>([]);
  const [filters, setFilters] = useState<FiltersType>({
    typeOfStay: [],
    priceRange: [0, 1000],
    rooms: { bedrooms: 0, beds: 0, bathrooms: 0 },
    amenities: [],
    propertyType: [],
  });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchKey, setFetchKey] = useState(0); // Unique key to prevent redundant requests
  const searchParams = useSearchParams();

  useEffect(() => {
    const savedFilters = localStorage.getItem("searchParams");
    if (savedFilters) {
      const { location, startDate, endDate, guests } = JSON.parse(savedFilters);
      setFilters((prevFilters) => ({
        ...prevFilters,
        location,
        dates: [startDate ? new Date(startDate) : null, endDate ? new Date(endDate) : null],
        guests: parseInt(guests, 10),
      }));
      localStorage.removeItem("searchParams");
    }

    const typeOfStay = searchParams.get("typeOfStay");
    if (typeOfStay) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        typeOfStay: [typeOfStay],
      }));
      setFetchKey((prevKey) => prevKey + 1);
    }
  }, [searchParams]);

  const fetchListings = async (page: number, append = false) => {
    setLoading(true);
    try {
      const query = buildQuery({
        location,
        dates,
        guests,
        ...filters,
        typeOfStay: filters.typeOfStay,
        priceRange: filters.priceRange,
        rooms: filters.rooms,
        propertyType: filters.propertyType,
        page,
        limit: 6,
      });

      console.log("Query Sent:", query);
      const listings = await fetchStayListingsWithQuery(query);
      const filteredListings = listings.filter((stay) => {
        const hasAmenities = filters.amenities.every((amenity: number) =>
          stay.amenityIds.includes(amenity)
        );
        const isInPriceRange =
          (stay.weekdayPrice >= filters.priceRange[0] &&
            stay.weekdayPrice <= filters.priceRange[1]) ||
          (stay.weekendPrice >= filters.priceRange[0] &&
            stay.weekendPrice <= filters.priceRange[1]);

        if (dates[0] && dates[1]) {
          const startDate = new Date(
            Date.UTC(
              dates[0].getFullYear(),
              dates[0].getMonth(),
              dates[0].getDate()
            )
          );
          const endDate = new Date(
            Date.UTC(
              dates[1].getFullYear(),
              dates[1].getMonth(),
              dates[1].getDate()
            )
          );

          return (
            hasAmenities &&
            isInPriceRange &&
            !stay.availableDates.some((dateStr) => {
              const date = new Date(dateStr);
              return isDateInRange(date, startDate, endDate);
            })
          );
        } else if (dates[0]) {
          const startDate = new Date(
            Date.UTC(
              dates[0].getFullYear(),
              dates[0].getMonth(),
              dates[0].getDate()
            )
          );
          return (
            hasAmenities &&
            isInPriceRange &&
            !stay.availableDates.includes(formatDate(startDate))
          );
        }
        return hasAmenities && isInPriceRange;
      });

      if (append) {
        setStayListings((prevListings) => [...prevListings, ...filteredListings]);
      } else {
        setStayListings(filteredListings);
      }

      setHasMore(filteredListings.length === 6); // If we received less than 6 listings, we have no more data to fetch
      onListingsFetched && onListingsFetched(filteredListings.length);
    } catch (error) {
      console.error("Failed to fetch stay listings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(0);
  }, [fetchKey]); // Only fetch when fetchKey changes

  useEffect(() => {
    // Trigger fetch when location, dates, or guests props change
    setFetchKey((prevKey) => prevKey + 1);
  }, [location, dates, guests]);

  const handleFilterChange = (updatedFilters: FiltersType) => {
    setFilters(updatedFilters);
    setPage(0); // Reset to the first page
    setFetchKey((prevKey) => prevKey + 1); // Update key to trigger useEffect
  };

  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(nextPage, true);
  };

  return (
    <div
      className={`nc-SectionGridFilterCard ${className}`}
      data-nc-id="SectionGridFilterCard"
    >
      <Heading2
        heading="Available Stays"
        location={location}
        dates={dates}
        guests={guests}
        numListings={stayListings.length}
      />

      <div className="mb-8 lg:mb-11">
        <TabFilters onFilterChange={handleFilterChange} filters={filters} />
      </div>
      {loading && !stayListings.length ? (
        <div className="skeleton-loader">Loading...</div>
      ) : (
        <>
          {stayListings.length ? (
            <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stayListings.map((stay) => (
                <StayCard2 key={stay.id} data={stay} />
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 dark:text-neutral-400 mt-8">
              No listings were found.
            </div>
          )}
          {hasMore && (
            <div className="flex mt-16 justify-center items-center">
              <ButtonPrimary onClick={handleShowMore}>Show More</ButtonPrimary>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SectionGridFilterCard;
