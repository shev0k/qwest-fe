import React, { FC } from "react";
import { StayDataType } from "@/data/types";
import StartRating from "@/components/StartRating";
import BtnLikeIcon from "@/components/BtnLikeIcon";
import SaleOffBadge from "@/components/SaleOffBadge";
import Badge from "@/shared/Badge";
import { PathName } from "@/routers/types";  
import Link from "next/link";
import GallerySlider from "./GallerySlider";

export interface StayCardProps {
  className?: string;
  data: StayDataType;
  showLikeButton?: boolean; 
  isLinkActive?: boolean;
  size?: "default" | "small";
}

const StayCard: FC<StayCardProps> = ({
  size = "default",
  className = "",
  data,
  showLikeButton = true, 
  isLinkActive = true,
}) => {
  const {
    galleryImageUrls,
    propertyType,
    street,
    title,
    bedrooms,
    like,
    weekdayPrice,
    reviewStart,
    reviewCount,
    id,
  } = data;


  const renderSliderGallery = () => {
    return (
      <div className="relative w-full">
        <GallerySlider
        uniqueID={`StayCard2_${id}`}
        ratioClass="aspect-w-12 aspect-h-11"
        galleryImageUrls={galleryImageUrls}
        imageClass="rounded-lg"
        href={`/listing-stay-detail/${id}` as PathName}
        />
        {showLikeButton && <BtnLikeIcon listingId={id} isLiked={like} className="absolute right-3 top-3 z-[1]" />}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={size === "default" ? "p-4 space-y-4" : "p-3 space-y-1"}>
        <div className={size === "default" ? "space-y-2" : "space-y-1"}>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {propertyType} · {bedrooms} beds
          </span>
          <div className="flex items-center space-x-2">
            <h2
              className={`font-semibold capitalize text-neutral-900 dark:text-white ${
                size === "default" ? "text-base" : "text-base"
              }`}
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
            <span className="">{street}</span>
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
          {!!reviewStart && (
            <StartRating reviewCount={reviewCount} point={reviewStart} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-StayCard group relative bg-white dark:bg-neutral-900 ${
        size === "default"
          ? "border border-neutral-100 dark:border-neutral-800 "
          : ""
      } rounded-2xl overflow-hidden hover:shadow-xl transition-shadow ${className}`}
      data-nc-id="StayCard"
    >
      {renderSliderGallery()}
      {isLinkActive ? <Link href={`/listing-stay-detail/${id}`}>{renderContent()}</Link> : renderContent()}
    </div>
  );
};

export default StayCard;
