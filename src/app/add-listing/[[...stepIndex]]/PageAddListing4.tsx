import React, { FC, useEffect, useState } from "react";
import { useListingForm } from '@/contexts/ListingFormContext';
import Checkbox from "@/shared/Checkbox";
import { fetchAmenities } from '@/api/amenityServices';
import { Amenity } from "@/data/types";

export interface PageAddListing4Props {}

const PageAddListing4: FC<PageAddListing4Props> = () => {
  const { listingData, updateListingData, setFormValid } = useListingForm();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<number>>(new Set());

  const formatCategoryName = (category: string) => {
    // Split the category string on underscores and format each part
    return category.split('_')
      .map(word => {
        // Capitalize each word and handle special cases for '&' reinsertion
        if (word === 'KITCHEN') {
          return 'Kitchen & ';
        } else if (word === 'DINING') {
          return 'Dining';
        } else if (word === 'LEISURE') {
          return 'Leisure & ';
        } else if (word === 'RECREATION') {
          return 'Recreation';
        } else if (word === 'ENTERTAINMENT') {
          return 'Entertainment & ';
        } else if (word === 'OTHERS') {
          return 'Others';
        } else {
          return word.charAt(0) + word.slice(1).toLowerCase();
        }
      })
      .join(' ')
      .replace(/ & /g, ' &'); // Ensure single spaces around '&'
  };
  

  useEffect(() => {
    const loadAmenities = async () => {
      const fetchedAmenities = await fetchAmenities();
      setAmenities(fetchedAmenities);
      if (listingData.amenityIds) {
        setSelectedAmenities(new Set(listingData.amenityIds));
      }
    };
    loadAmenities();
  }, []);

  useEffect(() => {
    setFormValid(selectedAmenities.size > 0);
  }, [selectedAmenities, setFormValid]);

  useEffect(() => {
    console.log("Listing Data Updated:", listingData); // Log the listingData whenever it changes
  }, [listingData]);

  const handleAmenityChange = (amenityId: number, isChecked: boolean) => {
    setSelectedAmenities((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(amenityId);
      } else {
        newSet.delete(amenityId);
      }
      updateListingData({ 
        ...listingData, 
        amenityIds: Array.from(newSet),
        amenityNames: Array.from(newSet).map(id => amenities.find(amenity => amenity.id === id)?.name || '')
      });
      return newSet;
    });
  };

  const categories = amenities.reduce((acc: Record<string, Amenity[]>, amenity: Amenity) => {
    const categoryName = formatCategoryName(amenity.category);
    (acc[categoryName] = acc[categoryName] || []).push(amenity);
    return acc;
  }, {});

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Amenities</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          The Property&apos;s Amenities and Services
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {Object.entries(categories).map(([category, amenities]) => (
        <div key={category}>
          <label className="text-lg font-semibold">{category}</label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {amenities.map((amenity) => (
              <Checkbox
                key={amenity.id}
                label={amenity.name}
                name={amenity.name}
                defaultChecked={selectedAmenities.has(amenity.id)}
                onChange={(isChecked) => handleAmenityChange(amenity.id, isChecked)}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default PageAddListing4;
