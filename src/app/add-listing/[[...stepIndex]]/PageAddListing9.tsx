import React, { FC, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import NcInputNumber from "@/components/NcInputNumber";
import { useListingForm } from '@/contexts/ListingFormContext';

const PageAddListing9: FC = () => {
  const { listingData, updateListingData, setFormValid } = useListingForm();
  const [minNights, setMinNights] = useState<number>(listingData.minimumNights || 1);
  const [maxNights, setMaxNights] = useState<number>(listingData.maximumNights || 7);

  useEffect(() => {
    // Always set the form validation to true
    setFormValid(true);
  }, [listingData.minimumNights, listingData.maximumNights, setFormValid]);

  useEffect(() => {
    setMinNights(listingData.minimumNights || 1);
    setMaxNights(listingData.maximumNights || 7);
  }, [listingData.minimumNights, listingData.maximumNights]);

  const handleNightChange = (field: 'minimumNights' | 'maximumNights', value: number) => {
    let updatedMinimumNights = minNights;
    let updatedMaximumNights = maxNights;

    if (field === 'minimumNights') {
      updatedMinimumNights = Math.max(1, value); // Minimum nights must be at least 1
      if (updatedMinimumNights > maxNights) {
        updatedMaximumNights = updatedMinimumNights; // Adjust maximum nights if it's less than minimum nights
      }
    } else if (field === 'maximumNights') {
      updatedMaximumNights = Math.max(1, value); // Maximum nights must be at least 1
      if (updatedMaximumNights < minNights) {
        updatedMaximumNights = minNights; // Ensure maximum nights is not less than minimum nights
      }
    }

    setMinNights(updatedMinimumNights);
    setMaxNights(updatedMaximumNights);
    updateListingData({ minimumNights: updatedMinimumNights, maximumNights: updatedMaximumNights });
  };

  const toggleDateAvailability = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]; // "YYYY-MM-DD" format

    const currentDates = listingData.availableDates || [];
    const newDates = currentDates.includes(dateString)
      ? currentDates.filter(d => d !== dateString)
      : [...currentDates, dateString];
    updateListingData({ availableDates: newDates });
  };

  useEffect(() => {
    console.log("Listing Data Updated:", listingData); // Log the listingData whenever it changes
  }, [listingData]);

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Guest Stay Duration</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Opting for shorter stays may increase the number of bookings, yet it requires more frequent preparation of your accommodation.
        </span>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      <div className="space-y-7">
        <NcInputNumber
          label="Nights min"
          defaultValue={minNights}
          onChange={(value) => handleNightChange('minimumNights', value)}
        />
        <NcInputNumber
          label="Nights max"
          defaultValue={maxNights}
          onChange={(value) => handleNightChange('maximumNights', value)}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold">Manage Your Calendar</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Updating your availability is straightforward: simply choose a date to mark it as available or unavailable. Modifications are still possible post-publishing.
        </span>
      </div>

      <div className="addListingDatePickerExclude">
        <DatePicker
          selected={null}
          onChange={date => {
            if (date) {
              const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
              toggleDateAvailability(normalizedDate);
            }
          }}
          monthsShown={2}
          showPopperArrow={false}
          excludeDates={(listingData.availableDates || []).map(dateStr => new Date(dateStr))}
          inline
          renderCustomHeader={(props) => <DatePickerCustomHeaderTwoMonth {...props} />}
          renderDayContents={(day, date) => (
            <DatePickerCustomDay
              dayOfMonth={day}
              date={date}
              onClick={() => date && toggleDateAvailability(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())))}
            />
          )}
        />
      </div>
    </>
  );
};

export default PageAddListing9;
