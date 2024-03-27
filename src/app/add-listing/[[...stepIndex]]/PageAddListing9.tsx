"use client";

import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import NcInputNumber from "@/components/NcInputNumber";
import React, { FC, useState } from "react";
import DatePicker from "react-datepicker";

export interface PageAddListing9Props {}

const PageAddListing9: FC<PageAddListing9Props> = () => {
  const [dates, setDates] = useState<number[]>([
    new Date("2024/03/15").getTime(),
    new Date("2024/03/04").getTime(),
    new Date("2024/03/25").getTime(),
    new Date("2024/03/29").getTime(),
    new Date("2024/04/15").getTime(),
    new Date("2024/04/04").getTime(),
    new Date("2024/04/20").getTime(),
    new Date("2024/07/06").getTime(),
    new Date("2024/07/09").getTime(),
    new Date("2024/08/15").getTime(),
  ]);

  const toggleDateAvailability = (dateTimestamp: number) => {
    setDates(prevDates =>
      prevDates.includes(dateTimestamp)
        ? prevDates.filter(date => date !== dateTimestamp)
        : [...prevDates, dateTimestamp]
        
    );
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Guest Stay Duration</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Opting for shorter stays may increase the number of bookings, yet it requires more frequent preparation of your accommodation
        </span>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-7">
        {/* ITEM */}
        <NcInputNumber label="Nights min" defaultValue={1} />
        <NcInputNumber label="Nights max" defaultValue={99} />
      </div>

      {/*  */}
      <div>
        <h2 className="text-2xl font-semibold">Manage Your Calendar</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Updating your availability is straightforward: simply choose a date to mark it as available or unavailable. Modifications are still possible post-publishing
        </span>
      </div>


      <div className="addListingDatePickerExclude">
        <DatePicker
          onChange={(date) => {
            let newDates = [];

            if (!date) {
              return;
            }
            const newTime = date.getTime();
            if (dates.includes(newTime)) {
              newDates = dates.filter((item) => item !== newTime);
            } else {
              newDates = [...dates, newTime];
            }
            setDates(newDates);
          }}
          // selected={startDate}
          monthsShown={2}
          showPopperArrow={false}
          excludeDates={dates.filter(Boolean).map((item) => new Date(item))}
          inline
          renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
          renderDayContents={(day, date) => {
            const dateTimestamp = date ? new Date(date.setHours(0, 0, 0, 0)).getTime() : 0;
            return (
              <DatePickerCustomDay
                dayOfMonth={day}
                date={date}
                onClick={() => toggleDateAvailability(dateTimestamp)}
              />
            );
          }}
        />
      </div>
    </>
  );
};

export default PageAddListing9;
