"use client";

import React, { FC, useEffect } from "react";
import { useListingForm } from '@/contexts/ListingFormContext';
import FormItem from "../FormItem";
import NcInputNumber from "@/components/NcInputNumber";
import Select from "@/shared/Select";

export interface PageAddListing3Props {}

const PageAddListing3: FC<PageAddListing3Props> = () => {
  const { listingData, updateListingData, setFormValid } = useListingForm();

  useEffect(() => {
    // Check if all required data for the page is valid
    const isValid = listingData.acreage > 0 &&  // Ensure acreage is selected
                    listingData.maxGuests >= 1 &&
                    listingData.bedrooms >= 1 &&
                    listingData.beds >= 1;
    setFormValid(isValid);
    console.log("Page 3 Form Validation State:", isValid);
  }, [listingData.acreage, listingData.maxGuests, listingData.bedrooms, listingData.beds, setFormValid]);

  const handleInputChange = (name: string, value: number) => {
    updateListingData({ [name]: value });
  };

  return (
    <>
      <h2 className="text-2xl font-semibold">Size of Stay</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div className="space-y-8">
        <FormItem label="Average Acreage (m²)">
          <Select
            value={listingData.acreage ? listingData.acreage.toString() : ""}
            onChange={(e) => handleInputChange('acreage', Number(e.target.value))}
          >
            <option value="">Select average acreage</option>
            {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </Select>
        </FormItem>
        <NcInputNumber label="Guests" defaultValue={listingData.maxGuests || 0} onChange={(value) => handleInputChange('maxGuests', value)} />
        <NcInputNumber label="Bedrooms" defaultValue={listingData.bedrooms || 0} onChange={(value) => handleInputChange('bedrooms', value)} />
        <NcInputNumber label="Beds" defaultValue={listingData.beds || 0} onChange={(value) => handleInputChange('beds', value)} />
        <NcInputNumber label="Bathrooms" defaultValue={listingData.bathrooms || 0} onChange={(value) => handleInputChange('bathrooms', value)} />
        <NcInputNumber label="Kitchens" defaultValue={listingData.kitchens || 0} onChange={(value) => handleInputChange('kitchens', value)} />
      </div>
    </>
  );
};

export default PageAddListing3;
