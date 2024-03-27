import React, { FC } from "react";
import Textarea from "@/shared/Textarea";

export interface PageAddListing6Props {}

const PageAddListing6: FC<PageAddListing6Props> = () => {
  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">
          Accommodation Details
        </h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Highlight the standout qualities of your property, including exclusive amenities such as high-speed internet access or private parking. Also, share what makes the surrounding area appealing
        </span>
      </div>


      <Textarea placeholder="..." rows={14} />
    </>
  );
};

export default PageAddListing6;
