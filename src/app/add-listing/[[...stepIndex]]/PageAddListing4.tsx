import React, { FC } from "react";
import Checkbox from "@/shared/Checkbox";

export interface PageAddListing4Props {}

const PageAddListing4: FC<PageAddListing4Props> = () => {
  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Amenities </h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
        The Property&apos;s Amenities and Services
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
      {/* General Amenities */}
      <div>
        <label className="text-lg font-semibold">General Amenities</label>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Checkbox label="High-Speed WiFi" name="High-Speed WiFi" defaultChecked />
          <Checkbox label="TV" name="TV" defaultChecked />
          <Checkbox label="Air Conditioning" name="Air Conditioning" defaultChecked />
          <Checkbox label="Heating" name="Heating" defaultChecked />
          <Checkbox label="Private Entrance" name="Private Entrance" defaultChecked />
        </div>
      </div>


      {/* Room Features */}
      <div>
        <label className="text-lg font-semibold">Room Features</label>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Checkbox label="Bedding" name="Bedding" defaultChecked />
          <Checkbox label="Work Desk" name="Work Desk" />
          <Checkbox label="Wardrobe/Closet" name="Wardrobe/Closet" defaultChecked />
          <Checkbox label="Accessible Room" name="Accessible Room" />
        </div>
      </div>

      {/* Kitchen & Dining */}
      <div>
        <label className="text-lg font-semibold">Kitchen & Dining</label>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Checkbox label="Coffee & Tea Facilities" name="Coffee & Tea Facilities" defaultChecked />
          <Checkbox label="Refrigerator & Mini Bar" name="Refrigerator & Mini Bar" defaultChecked />
        </div>
      </div>

        {/* Bathroom Amenities */}
        <div>
        <label className="text-lg font-semibold">Bathroom Amenities</label>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Checkbox label="Shower & Bathtub" name="Shower & Bathtub" defaultChecked />
          <Checkbox label="Essential Toiletries" name="Essential Toiletries" defaultChecked />
        </div>
      </div>

      {/* Leisure & Recreation */}
      <div>
        <label className="text-lg font-semibold">Leisure & Recreation</label>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Checkbox label="Swimming Pool" name="Swimming Pool" defaultChecked />
          <Checkbox label="Gym Access" name="Gym Access" />
          <Checkbox label="Beach Access" name="Beach Access" />
        </div>
      </div>

      {/* Additional Services */}
      <div>
        <label className="text-lg font-semibold">Additional Services</label>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Checkbox label="Concierge Service" name="Concierge Service" defaultChecked />
          <Checkbox label="Luggage Assistance" name="Luggage Assistance" defaultChecked />
          <Checkbox label="Baby Care Facilities" name="Baby Care Facilities" />
        </div>
      </div>

      {/* Entertainment & Others */}
      <div>
      <label className="text-lg font-semibold">Entertainment & Others</label>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Checkbox label="Board Games & Entertainment" name ="Board Games & Entertainment" />
          <Checkbox label="In-Room Coffee Maker" name="In-Room Coffee Maker" defaultChecked />
        </div>
      </div>

      </div>
    </>
  );
};

export default PageAddListing4;
