import React, { FC, Fragment, useState } from "react";
import DatePicker from "react-datepicker";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";

interface SectionDateRangeProps {
  additionalUnavailableDates?: Date[]; // Optional prop for additional unavailable dates fetched from the backend
}

const SectionDateRange: FC<SectionDateRangeProps> = ({ additionalUnavailableDates = [] }) => {
  // Fake data for demonstration
    // Combine fake data with any additional unavailable dates passed as props
    const combinedUnavailableDates = [ ...additionalUnavailableDates];


  const renderSectionCheckIndate = () => {
    return (
      <div className="listingSection__wrap overflow-hidden">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Availability</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Below are the dates that are currently unavailable. Prices may be higher on weekends or holidays. 
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* CONTENT */}

        <div className="addListingDatePickerExclude">
        <DatePicker
          onChange={() => {}}
          monthsShown={2}
          showPopperArrow={false}
          excludeDates={combinedUnavailableDates}
          inline
          renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
          renderDayContents={(day, date) => (
            <DatePickerCustomDay dayOfMonth={day} date={date} />
          )}
        />
      </div>
      </div>
    );
  };

  return renderSectionCheckIndate();
};

export default SectionDateRange;
