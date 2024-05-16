"use client";

import React, { FC, useState, useEffect, useMemo, useCallback } from "react";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Label from "@/components/Label";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";
import { useListingForm } from '@/contexts/ListingFormContext';
import ButtonSecondary from "@/shared/ButtonSecondary";
import axios from "axios";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
  };
  place_id: string;
  types: string[];
}

interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
}

export interface PageAddListing2Props {}

const PageAddListing2: FC<PageAddListing2Props> = () => {
  const { listingData, updateListingData, setFormValid } = useListingForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateListingData({ [name]: value });
  };

  useEffect(() => {
    const isValid = Boolean(listingData.street && listingData.street.trim() !== '') &&
                    Boolean(listingData.city && listingData.city.trim() !== '') &&
                    Boolean(listingData.postalCode && listingData.postalCode.trim() !== '') &&
                    Boolean(listingData.country && listingData.country.trim() !== '');
    setFormValid(isValid);
    console.log("Form Validation State:", isValid);
  }, [listingData.street, listingData.city, listingData.postalCode, listingData.country, setFormValid]);


  const handleUseCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAyXWlzjN4b3X9kQllFwTeJwFVa1Eqhb-8`;
        try {
          const response = await axios.get<GeocodeResponse>(url);
          if (response.data.status === "OK") {
            const fullAddress = response.data.results.find(result => {
              const components = result.address_components;
              const street = components.some(comp => comp.types.includes("route"));
              const city = components.some(comp => comp.types.includes("locality"));
              const state = components.some(comp => comp.types.includes("administrative_area_level_1"));
              const postalCode = components.some(comp => comp.types.includes("postal_code"));
              const country = components.some(comp => comp.types.includes("country"));
              return street && city && state && postalCode && country;
            });

            if (fullAddress) {
              const address = {
                street: fullAddress.address_components.find(comp => comp.types.includes("route"))?.long_name,
                city: fullAddress.address_components.find(comp => comp.types.includes("locality"))?.long_name,
                state: fullAddress.address_components.find(comp => comp.types.includes("administrative_area_level_1"))?.long_name,
                postalCode: fullAddress.address_components.find(comp => comp.types.includes("postal_code"))?.long_name,
                country: fullAddress.address_components.find(comp => comp.types.includes("country"))?.long_name,
                lat: latitude,
                lng: longitude
              };
              updateListingData(address);
            } else {
              console.error("Complete address not found in any of the results.");
            }
          } else {
            console.error("Geocoding failed:", response.data.status);
          }
        } catch (error) {
          console.error("Error obtaining location details:", error);
        }
      }, (error) => {
        console.error("Error obtaining location:", error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const googleMapsEmbedUrl = useMemo(() => {
    if (listingData.street && listingData.city && listingData.country && listingData.postalCode) {
      const addressQuery = encodeURIComponent(`${listingData.street}, ${listingData.city}, ${listingData.postalCode}, ${listingData.country}`);
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyAyXWlzjN4b3X9kQllFwTeJwFVa1Eqhb-8&q=${addressQuery}`;
    }
    return "https://www.google.com/maps/embed/v1/view?key=AIzaSyAyXWlzjN4b3X9kQllFwTeJwFVa1Eqhb-8&center=51.44279778789327,5.511316016852143&zoom=12";
  }, [listingData]);

  const detailedAddress = useMemo(() => {
    if (listingData.street && listingData.city && listingData.postalCode && listingData.country) {
      return `${listingData.street}, ${listingData.city}, ${listingData.postalCode}, ${listingData.country}`;
    }
    return "Not yet completed";
  }, [listingData]);

  return (
    <>
      <h2 className="text-2xl font-semibold">Stay Location</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div className="space-y-8">
        <ButtonSecondary onClick={handleUseCurrentLocation}>
          <MapPinIcon className="w-5 h-5 color-yellow-accent dark:text-neutral-400" />
          <span className="ml-3">Use Current Location</span>
        </ButtonSecondary>
        <FormItem label="Country">
          <Select name="country" value={listingData.country || ''} onChange={handleChange}>
            <option value="">Select Country</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Japan">Japan</option>
            <option value="France">France</option>
            <option value="England">England</option>
            <option value="Romania">Romania</option>
          </Select>
        </FormItem>
        <FormItem label="Street">
          <Input name="street" value={listingData.street || ''} placeholder="Enter street address" onChange={handleChange} />
        </FormItem>
        <FormItem label="Room Number (optional)">
          <Input name="roomNumber" value={listingData.roomNumber || ''} placeholder="Enter room number" onChange={handleChange} />
        </FormItem>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
          <FormItem label="City">
            <Input name="city" value={listingData.city || ''} placeholder="Enter city" onChange={handleChange} />
          </FormItem>
          <FormItem label="State">
            <Input name="state" value={listingData.state || ''} placeholder="Enter state" onChange={handleChange} />
          </FormItem>
          <FormItem label="Postal code">
            <Input name="postalCode" value={listingData.postalCode || ''} placeholder="Enter postal code" onChange={handleChange} />
          </FormItem>
        </div>
        <div>
          <Label>Detailed Address</Label>
          <span className="block mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {detailedAddress}
          </span>
          <div className="mt-4 aspect-w-5 aspect-h-5 sm:aspect-h-3">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              loading="lazy"
              allowFullScreen
              src={googleMapsEmbedUrl}
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAddListing2;
