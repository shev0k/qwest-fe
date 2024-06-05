"use client";
import React, { FC, useState, useEffect } from "react";
import StaySearchForm from "./(stay-search-form)/StaySearchForm";
import { GuestsObject } from "./GuestsInput";

export type SearchTab = "Stays";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: SearchTab;
  currentPage?: "Stays";
  onSearch?: (location: string, dates: [Date | null, Date | null], guests: GuestsObject) => void;
  initialLocation?: string;
  initialDates?: [Date | null, Date | null];
  initialGuests?: GuestsObject;
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Stays",
  currentPage,
  onSearch,
  initialLocation = "",
  initialDates = [null, null],
  initialGuests = { guestAdults: 1, guestChildren: 0, guestInfants: 0 },
}) => {
  const tabs: SearchTab[] = ["Stays"];
  const [tabActive, setTabActive] = useState<SearchTab>(currentTab);

  useEffect(() => {
    if (initialLocation || initialDates[0] || initialGuests.guestAdults !== 1 || initialGuests.guestChildren !== 0 || initialGuests.guestInfants !== 0) {
      onSearch && onSearch(initialLocation, initialDates, initialGuests);
    }
  }, []); // Empty dependency array to run only once on mount

  const handleTabClick = (tab: SearchTab) => {
    setTabActive(tab);
  };

  const renderTab = () => {
    return (
      <ul className="ml-2 sm:ml-6 md:ml-12 flex space-x-5 sm:space-x-8 lg:space-x-11 overflow-x-auto hiddenScrollbar">
        {tabs.map((tab) => {
          const active = tab === tabActive;
          return (
            <li
              onClick={() => handleTabClick(tab)}
              className={`flex-shrink-0 flex items-center cursor-pointer text-sm lg:text-base font-medium ${active ? "" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-400"}`}
              key={tab}
            >
              {active && (
                <span className="block w-2.5 h-2.5 rounded-full bg-neutral-800 dark:bg-neutral-100 mr-2" />
              )}
              <span>{tab}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderForm = () => {
    switch (tabActive) {
      case "Stays":
        return <StaySearchForm onSearch={onSearch} initialLocation={initialLocation} initialDates={initialDates} initialGuests={initialGuests} />;
      default:
        return null;
    }
  };

  return (
    <div className={`nc-HeroSearchForm w-full max-w-6xl py-5 lg:py-0 ${className}`}>
      {renderTab()}
      {renderForm()}
    </div>
  );
};

export default HeroSearchForm;
