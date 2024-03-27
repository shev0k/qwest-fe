"use client";

import React, { FC, useState } from "react";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";

export interface PageAddListing1Props {}

const PageAddListing1: FC<PageAddListing1Props> = () => {
  const [propertyTypeDesc, setPropertyTypeDesc] = useState("A self-contained unit in a larger building, offering urban living spaces.");
  const [rentalFormDesc, setRentalFormDesc] = useState("Guests have the whole place to themselves—there's a private entrance and no shared spaces. A bedroom, bathroom, and kitchen are usually included.");

  const propertyDescriptions: { [key: string]: string } = {
    Apartment: "A self-contained unit in a larger building, offering urban living spaces.",
    Hotel: "Professional hospitality businesses with a unique style or theme.",
    Condo: "A private residence within a larger complex, owned individually.",
    Cabin: "A small, rustic dwelling in a natural setting, perfect for getaways.",
    Townhouse: "A multi-floor home that shares one or more walls with adjacent properties.",
    Penthouse: "A luxury apartment on the top floor of a building, offering expansive views.",
    Cottage: "A charming and cozy residence, often found in rural or semi-rural locations.",
    Bungalow: "A single-story house, offering compact and efficient living space.",
    Loft: "A large, adaptable open space, often converted for residential use."
  };

  const rentalFormDescriptions: { [key: string]: string } = {
    EntirePlace: "Guests have the whole place to themselves—there's a private entrance and no shared spaces. A bedroom, bathroom, and kitchen are usually included.",
    PrivateRoom: "Guests have a private room for sleeping. Other areas could be shared.",
    HotelRoom: "Enjoy the comfort and amenities of a professional hospitality setting, with either private or shared rooms.",
    SharedRoom: "Share a room or common space with other guests, offering a more communal and budget-friendly option."
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    const description = propertyDescriptions[selectedType];
    setPropertyTypeDesc(description || "Select the type of property to list.");
  };

  const handleRentalFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedForm = e.target.value;
    const description = rentalFormDescriptions[selectedForm];
    setRentalFormDesc(description || "Choose the rental form that best describes your offering.");
  };

  return (
    <>
      <h2 className="text-2xl font-semibold">Type of Stay</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* Property Type ITEM */}
        <FormItem
          label="Property Type"
          desc={propertyTypeDesc}
        >
          <Select onChange={handlePropertyTypeChange}>
            <option value="Apartment">Apartment</option>
            <option value="Hotel">Hotel</option>
            <option value="Condo">Condo</option>
            <option value="Cabin">Cabin</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Cottage">Cottage</option>
            <option value="Bungalow">Bungalow</option>
            <option value="Loft">Loft</option>
          </Select>
        </FormItem>
        {/* Additional FormItems */}
        <FormItem
          label="Stay's Name"
          desc="Ex. craft a memorable name by combining: Property Type + Unique Feature + Location."
        >
          <Input placeholder="Stay's Name..." />
        </FormItem>
        <FormItem
          label="Rental Form"
          desc={rentalFormDesc}
        >
          <Select onChange={handleRentalFormChange}>
            <option value="EntirePlace">Entire Place</option>
            <option value="PrivateRoom">Private Room</option>
            <option value="HotelRoom">Hotel Room</option>
            <option value="SharedRoom">Shared Room</option>
          </Select>
        </FormItem>
      </div>
    </>
  );
};

export default PageAddListing1;
