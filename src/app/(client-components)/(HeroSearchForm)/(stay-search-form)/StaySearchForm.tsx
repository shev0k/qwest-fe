"use client";

import React, { FC, useState, useEffect } from "react";
import LocationInput from "../LocationInput";
import GuestsInput, { GuestsObject } from "../GuestsInput";
import StayDatesRangeInput from "./StayDatesRangeInput";
import ButtonSubmit from "../ButtonSubmit";
import "../../../globals.css"; // Your custom styles

interface StaySearchFormProps {
  onSearch?: (location: string, dates: [Date | null, Date | null], guests: GuestsObject) => void;
  initialLocation?: string;
  initialDates?: [Date | null, Date | null];
  initialGuests?: GuestsObject;
}

const StaySearchForm: FC<StaySearchFormProps> = ({
  onSearch,
  initialLocation = "",
  initialDates = [null, null],
  initialGuests = { guestAdults: 1, guestChildren: 0, guestInfants: 0 },
}) => {
  const [location, setLocation] = useState(initialLocation);
  const [dates, setDates] = useState<[Date | null, Date | null]>(initialDates);
  const [guests, setGuests] = useState<GuestsObject>(initialGuests);

  useEffect(() => {
    setLocation(initialLocation);
    setDates(initialDates);
    setGuests(initialGuests);
  }, [initialLocation, initialDates, initialGuests]);

  const handleLocationChange = (value: string) => {
    setLocation(value);
  };

  const handleDatesChange = (dates: [Date | null, Date | null]) => {
    setDates(dates);
  };

  const handleGuestsChange = (updatedGuests: GuestsObject) => {
    setGuests(updatedGuests);
  };

  const handleSubmit = () => {
    onSearch && onSearch(location, dates, guests);
  };

  return (
    <form className="w-full relative mt-8 flex items-center justify-between rounded-full shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800">
      <LocationInput
        className="flex-[1.5]"
        onChange={handleLocationChange}
        value={location}
      />
      <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>
      <StayDatesRangeInput
        className="flex-1"
        onChange={handleDatesChange}
        value={dates}
      />
      <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>
      <GuestsInput
        className="flex-1"
        onChange={handleGuestsChange}
        value={guests}
      />
      <div className="flex justify-center items-center px-4">
        <ButtonSubmit onClick={handleSubmit} />
      </div>
    </form>
  );
};

export default StaySearchForm;
