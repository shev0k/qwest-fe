import StayCard from "@/components/StayCard";
import { DEMO_STAY_LISTINGS } from "@/data/listings";
import React, { FC, useEffect } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Route } from "@/routers/types";
import { useListingForm } from '@/contexts/ListingFormContext';

export interface PageAddListing10Props {}

const PageAddListing10: FC<PageAddListing10Props> = () => {
  const { listingData, setFormValid, updateListingData } = useListingForm();

  useEffect(() => {
    setFormValid(true);

    // Set the listing creation date if it's not already set
    if (!listingData.date) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // Format as yyyy-MM-dd
      updateListingData({ ...listingData, date: formattedDate });
    }
  }, [setFormValid, listingData, updateListingData]);

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Congratulations 🎉</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Fantastic job! You&apos;ve successfully finished creating your listing. It&apos;s now pending review before going live.
        </span>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div>
        <h3 className="text-lg font-semibold">This is your listing</h3>
        <div className="max-w-xs">
          <StayCard
            className="mt-8"
            data={listingData}
            showLikeButton={false}
            isLinkActive={false}
          />
        </div>
        <div className="flex items-center space-x-5 mt-8">
          <ButtonSecondary href={"/add-listing/1" as Route}>
            <PencilSquareIcon className="color-yellow-accent h-5 w-5" />
            <span className="ml-3">Edit</span>
          </ButtonSecondary>
        </div>
      </div>
      {/*  */}
    </>
  );
};

export default PageAddListing10;
