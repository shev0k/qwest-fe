import React, { FC } from "react";
import GallerySlider from "@/components/GallerySlider";
import { StayDataType } from "@/data/types";
import { PathName } from "@/routers/types";  
import StartRating from "@/components/StartRating";
import BtnLikeIcon from "@/components/BtnLikeIcon";
import Link from "next/link";

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
    reviewStart,
    reviewCount,
    weekdayPrice,
    bedrooms,
    like = false,
  } = data;

  // Construct the address string
  const address = `${city}, ${country}`;

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
          {propertyType} · {bedrooms} beds
        </span>
        <div className="flex items-center space-x-2">
          <h2
            className={`font-semibold capitalize text-neutral-900 dark:text-white ${size === "default" ? "text-base" : "text-sm"}`}
          >
            <span className="line-clamp-1">{title}</span>
          </h2>
        </div>
        <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-1.5">
          <span>{address}</span>
        </div>
      </div>
      <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
      <div className="flex justify-between items-center">
        <span className="text-base font-semibold">{"$"}{weekdayPrice}{size === "default" && "/night"}</span>
        {!!reviewStart && <StartRating reviewCount={reviewCount} point={reviewStart} />}
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
