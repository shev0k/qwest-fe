import React, { FC, useEffect, useState } from "react";
import GallerySlider from "@/components/GallerySlider";
import { StayDataType } from "@/data/types";
import { PathName } from "@/routers/types";  
import StartRating from "@/components/StartRating";
import BtnLikeIcon from "@/components/BtnLikeIcon";
import Link from "next/link";
import { fetchReviewsByStayListing } from "@/api/reviewServices"; // Import the fetch function

export interface StayCard2Props {
  className?: string;
  data: StayDataType; 
  size?: "default" | "small";
}

const StayCard2: FC<StayCard2Props> = ({
  size = "default",
  className = "",
  data,
}) => {
  // Destructuring directly from `data`
  const {
    id,
    title,
    galleryImageUrls,
    country,
    propertyType,
    city,
    weekdayPrice,
    bedrooms,
    like = false,
  } = data;

  // State for reviews
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    // Fetch reviews for the stay listing
    const fetchReviewData = async () => {
      try {
        const reviews = await fetchReviewsByStayListing(id);
        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
        
        setReviewCount(totalReviews);
        setAverageRating(parseFloat(averageRating.toFixed(1))); // Format to one decimal place
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviewData();
  }, [id]);

  // Construct the address string
  const address = `${city}, ${country}`;

  const formatPropertyType = (propertyType: string): string => {
    if (!propertyType) return '';
    return propertyType.charAt(0).toUpperCase() + propertyType.slice(1).toLowerCase();
  };

  const renderSliderGallery = () => (
    <div className="relative w-full">
      <GallerySlider
        uniqueID={`StayCard2_${id}`}
        ratioClass="aspect-w-12 aspect-h-11"
        galleryImageUrls={galleryImageUrls}
        imageClass="rounded-lg"
        href={`/listing-stay-detail/${id}` as PathName}
      />
      <BtnLikeIcon listingId={id} isLiked={like} className="absolute right-3 top-3 z-[1]" />
    </div>
  );

  const renderContent = () => (
    <div className={`${size === "default" ? "mt-3 space-y-3" : "mt-2 space-y-2"}`}>
      <div className="space-y-2">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {formatPropertyType(propertyType)} · {bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}
        </span>
        <div className="flex items-center space-x-2">
          <h2
            className={`font-semibold capitalize text-neutral-900 dark:text-white ${size === "default" ? "text-base" : "text-sm"}`}
          >
            <span className="line-clamp-1">{title}</span>
          </h2>
        </div>
        <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-1.5">
            {size === "default" && (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
            <span className="">{address}</span>
          </div>
      </div>
      <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
      <div className="flex justify-between items-center">
      <span className="text-base font-semibold">
            ${weekdayPrice}
            {` `}
            {size === "default" && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                /night
              </span>
            )}
          </span>
        {!!reviewCount && <StartRating reviewCount={reviewCount} point={averageRating} />}
      </div>
    </div>
  );

  return (
    <div className={`nc-StayCard2 group relative ${className}`}>
      {renderSliderGallery()}
      <Link href={`/listing-stay-detail/${id}`}>
        {renderContent()}
      </Link>
    </div>
  );
};

export default StayCard2;
