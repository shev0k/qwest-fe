import React, { useEffect } from "react";
import { FC } from "react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { Route } from "@/routers/types";
import { useListingForm } from '@/contexts/ListingFormContext';
import { updateStayListing } from "@/api/stayServices"; // Adjust the path as needed

export interface CommonLayoutProps {
  children: React.ReactNode;
  params: {
    stepIndex: string;
  };
  isFormValid?: boolean;
}

const CommonLayout: FC<CommonLayoutProps> = ({ children, params, isFormValid = true }) => {
  const router = useRouter();
  const { listingData, submitListing, originalAuthorId, isEditing, setIsEditing } = useListingForm();
  const index = Number(params.stepIndex) || 1;
  const nextHref = (
    index < 10 ? `/add-listing/${index + 1}` : `/add-listing/1`
  ) as Route<string>;
  const backHref = (
    index > 1 ? `/add-listing/${index - 1}` : `/add-listing/1`
  ) as Route<string>;

  useEffect(() => {
    const savedData = sessionStorage.getItem('listingFormData');
    const savedAuthorId = sessionStorage.getItem('originalAuthorId');
    if (savedData && savedAuthorId) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [index, setIsEditing]);

  const clearSessionData = () => {
    sessionStorage.removeItem('listingFormData');
    sessionStorage.removeItem('originalAuthorId');
  };

  const handleNextClick = async () => {
    if (index === 10 && isFormValid) {
      if (isEditing && listingData.id) {
        const updatedListingData = {
          ...listingData,
          authorId: originalAuthorId ?? listingData.authorId,
        };
        await updateStayListing(listingData.id.toString(), updatedListingData);
        clearSessionData();
        router.push(`/listing-stay-detail/${listingData.id}`);
      } else {
        const listingUrl = await submitListing();
        if (listingUrl) {
          clearSessionData();
          router.push(listingUrl as Route<string>);
        } else {
          router.push("/" as Route<string>);
        }
      }
    }
  };

  const nextBtnText = index === 10 ? (isEditing ? "Update listing" : "Publish listing") : "Continue";

  useEffect(() => {
    return () => {
      clearSessionData();
    };
  }, []);

  return (
    <div className={`nc-PageAddListing1 px-4 max-w-3xl mx-auto pb-24 pt-14 sm:py-24 lg:pb-32`}>
      <div className="space-y-11">
        <div>
          <span className="text-4xl font-semibold">{index}</span>{" "}
          <span className="text-lg text-neutral-500 dark:text-neutral-400">
            / 10
          </span>
        </div>
        <div className="listingSection__wrap ">{children}</div>
        <div className="flex justify-end space-x-5">
          <ButtonSecondary href={backHref}>Go back</ButtonSecondary>
          <ButtonPrimary
            href={index < 10 ? nextHref : undefined}
            onClick={handleNextClick}
            disabled={!isFormValid}
          >
            {nextBtnText}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default CommonLayout;
