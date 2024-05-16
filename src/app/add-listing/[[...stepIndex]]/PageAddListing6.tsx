import React, { FC, useEffect, useState } from "react";
import { useListingForm } from '@/contexts/ListingFormContext';
import Textarea from "@/shared/Textarea";

export interface PageAddListing6Props {}

const PageAddListing6: FC<PageAddListing6Props> = () => {
  const { listingData, updateListingData, setFormValid } = useListingForm();
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    // Load initial description from context if available
    setDescription(listingData.accommodationDescription || "");
  }, [listingData.accommodationDescription]);

  useEffect(() => {
    // Validate form only if the description is filled
    setFormValid(description.trim().length > 0);
  }, [description, setFormValid]);

  useEffect(() => {
    console.log("Listing Data Updated:", listingData); // Log the listingData whenever it changes
  }, [listingData]);

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
    updateListingData({ ...listingData, accommodationDescription: event.target.value });
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">
          Accommodation Details
        </h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Highlight the standout qualities of your property, including exclusive amenities such as high-speed internet access or private parking. Also, share what makes the surrounding area appealing.
        </span>
      </div>

      <Textarea
        placeholder="Describe your property here..."
        rows={14}
        value={description}
        onChange={handleDescriptionChange}
      />
    </>
  );
};

export default PageAddListing6;
