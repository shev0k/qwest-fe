import React from "react";
import { ReactNode } from "react";

export interface Heading2Props {
  heading?: ReactNode;
  subHeading?: ReactNode;
  className?: string;
  location?: string;
  dates?: [Date | null, Date | null];
  guests?: number;
  numListings?: number;
}

const formatDate = (date: Date | null) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
};

const Heading2: React.FC<Heading2Props> = ({
  className = "",
  heading = "Available Stays",
  subHeading,
  location = "Tokyo",
  dates = [null, null],
  guests = 2,
  numListings = 18,
}) => {
  const formattedStartDate = dates[0] ? formatDate(dates[0]) : "No date given";
  const formattedEndDate = dates[1] ? formatDate(dates[1]) : "";

  return (
    <div className={`mb-12 lg:mb-16 ${className}`}>
      <h2 className="text-4xl font-semibold">{heading}</h2>
      {subHeading ? (
        subHeading
      ) : (
        <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
          {numListings === 0 ? "No Stays" : `${numListings} ${numListings === 1 ? "Stay" : "Stays"}`}
          <span className="mx-2">·</span>
          {formattedStartDate}
          {formattedEndDate && ` - ${formattedEndDate}`}
          <span className="mx-2">·</span>
          {guests} {guests === 1 ? "Guest" : "Guests"}
        </span>
      )}
    </div>
  );
};

export default Heading2;
