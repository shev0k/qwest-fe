import React, { FC, useState, useEffect } from "react";
import { useListingForm } from '@/contexts/ListingFormContext';
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";

export interface PageAddListing5Props {}

const PageAddListing5: FC<PageAddListing5Props> = () => {
  const { listingData, updateListingData, setFormValid } = useListingForm();
  const [newRestriction, setNewRestriction] = useState<string>('');
  const [specialRestrictions, setSpecialRestrictions] = useState<string[]>([]);
  const [checkInHours, setCheckInHours] = useState<string>(listingData.checkInHours || '');
  const [checkOutHours, setCheckOutHours] = useState<string>(listingData.checkOutHours || '');
  const [checkInHoursError, setCheckInHoursError] = useState<string>('');
  const [checkOutHoursError, setCheckOutHoursError] = useState<string>('');

  useEffect(() => {
    const initialRestrictions = listingData.specialRestrictions && listingData.specialRestrictions.length > 0 ? 
                                listingData.specialRestrictions : ["None Specified"];
    setSpecialRestrictions(initialRestrictions);
    validateForm(checkInHours, checkOutHours);
  }, [listingData.specialRestrictions]);

  useEffect(() => {
    console.log("Listing Data Updated:", listingData);
  }, [listingData]);

  const handleAddRestriction = () => {
    if (newRestriction) {
      const updatedRestrictions = specialRestrictions.filter(r => r !== "None Specified").concat(newRestriction);
      setSpecialRestrictions(updatedRestrictions);
      updateListingData({ ...listingData, specialRestrictions: updatedRestrictions });
      setNewRestriction('');
    }
  };

  const handleDeleteRestriction = (index: number) => {
    const updatedRestrictions = specialRestrictions.filter((_, idx) => idx !== index);
    if (updatedRestrictions.length === 0) {
      updatedRestrictions.push("None Specified");
    }
    setSpecialRestrictions(updatedRestrictions);
    updateListingData({ ...listingData, specialRestrictions: updatedRestrictions });
  };

  const formatTimeInput = (value: string): string => {
    const cleanValue = value.replace(/[^\d]/g, ''); // Remove non-numeric characters
    const length = cleanValue.length;

    if (length <= 2) return cleanValue; // Allow input of hours (00-23)
    if (length <= 4) return `${cleanValue.slice(0, 2)}:${cleanValue.slice(2)}`; // Format as HH:mm
    if (length <= 6) return `${cleanValue.slice(0, 2)}:${cleanValue.slice(2, 4)} - ${cleanValue.slice(4)}`; // Format as HH:mm - HH
    return `${cleanValue.slice(0, 2)}:${cleanValue.slice(2, 4)} - ${cleanValue.slice(4, 6)}:${cleanValue.slice(6)}`; // Format as HH:mm - HH:mm
  };

  const validateTimeRange = (value: string): boolean => {
    const timeRangeRegex = /^([01]\d|2[0-3]):[0-5]\d\s-\s([01]\d|2[0-3]):[0-5]\d$/;
    return timeRangeRegex.test(value);
  };

  const handleCheckInHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatTimeInput(e.target.value);
    setCheckInHours(value);
    if (validateTimeRange(value)) {
      setCheckInHoursError('');
      updateListingData({ checkInHours: value });
    } else {
      setCheckInHoursError('Please enter a valid time range (e.g., 08:00 - 12:00)');
    }
    validateForm(value, checkOutHours);
  };

  const handleCheckOutHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatTimeInput(e.target.value);
    setCheckOutHours(value);
    if (validateTimeRange(value)) {
      setCheckOutHoursError('');
      updateListingData({ checkOutHours: value });
    } else {
      setCheckOutHoursError('Please enter a valid time range (e.g., 14:00 - 16:00)');
    }
    validateForm(checkInHours, value);
  };

  const validateForm = (checkIn: string, checkOut: string) => {
    if (validateTimeRange(checkIn) && validateTimeRange(checkOut)) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const renderNoInclude = (text: string, index: number) => {
    return (
      <div className="flex items-center justify-between py-3" key={index}>
        <span className="text-neutral-6000 dark:text-neutral-400 font-medium">
          {text}
        </span>
        {text !== "None Specified" && (
          <i className="text-2xl text-neutral-400 las la-times-circle hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
             onClick={() => handleDeleteRestriction(index)}
          ></i>
        )}
      </div>
    );
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Accommodation Guidelines</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Potential guests will review your property&apos;s regulations prior to booking.
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div className="space-y-8">
        <h3 className="text-lg font-semibold">Check-in & Check-out</h3>
        <div className="flex flex-col space-y-3">
          <Input
            className="!h-full"
            placeholder="Check-in hours (e.g., 08:00 - 12:00)"
            value={checkInHours}
            onChange={handleCheckInHoursChange}
            type="text"
          />
          {checkInHoursError && <span className="text-red-500 text-sm">{checkInHoursError}</span>}
          <Input
            className="!h-full"
            placeholder="Check-out hours (e.g., 14:00 - 16:00)"
            value={checkOutHours}
            onChange={handleCheckOutHoursChange}
            type="text"
          />
          {checkOutHoursError && <span className="text-red-500 text-sm">{checkOutHoursError}</span>}
        </div>
      </div>
      <div className="space-y-8">
        <span className="block text-lg font-semibold">Special Notes</span>
        <div className="flow-root">
          <div className="-my-3 divide-y divide-neutral-100 dark:divide-neutral-800">
            {specialRestrictions.map((restriction, index) => renderNoInclude(restriction, index))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-5">
          <Input
            className="!h-full"
            placeholder="Ex. No smoking"
            value={newRestriction}
            onChange={(e) => setNewRestriction(e.target.value)}
          />
          <ButtonPrimary className="flex-shrink-0" onClick={handleAddRestriction}>
            <i className="text-xl las la-plus"></i>
            <span className="ml-3">Add tag</span>
          </ButtonPrimary>
        </div>
      </div>
    </>
  );
};

export default PageAddListing5;
