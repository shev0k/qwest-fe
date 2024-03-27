"use client";

import { MapPinIcon } from "@heroicons/react/24/solid";
import LocationMarker from "@/components/AnyReactComponent/LocationMarker";
import Label from "@/components/Label";
import GoogleMapReact from "google-map-react";
import React, { FC } from "react";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";

export interface PageAddListing2Props {}

const PageAddListing2: FC<PageAddListing2Props> = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold">Stay Location</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        <ButtonSecondary>
          <MapPinIcon className="w-5 h-5 color-yellow-accent dark:text-neutral-400" />
          <span className="ml-3">Use Current Location</span>
        </ButtonSecondary>
        {/* ITEM */}
        <FormItem label="Country">
          <Select>
            <option value="Netherlands">Netherlands</option>
            <option value="Japan">Japan</option>
            <option value="France">France</option>
            <option value="England">England</option>
            <option value="Romania">Romania</option>
          </Select>
        </FormItem>
        <FormItem label="Street">
          <Input placeholder="ex. Tongelresestraat 418" />
        </FormItem>
        <FormItem label="Room Number (optional)">
          <Input placeholder="ex. 103"/>
        </FormItem>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
          <FormItem label="City">
            <Input placeholder="ex. Eindhoven"/>
          </FormItem>
          <FormItem label="State">
            <Input placeholder="ex. Noord-Brabant"/>
          </FormItem>
          <FormItem label="Postal code">
            <Input placeholder="ex. 5642NH"/>
          </FormItem>
        </div>
        <div>
          <Label>Detailed Address</Label>
          <span className="block mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Tongelresestraat 418, 5642 NH Eindhoven
          </span>
          <div className="mt-4">
            <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3">
              <div className="rounded-xl overflow-hidden">
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: "AIzaSyAGVJfZMAKYfZ71nzL_v5i3LjTTWnCYwTY",
                  }}
                  yesIWantToUseGoogleMapApiInternals
                  defaultZoom={15}
                  defaultCenter={{
                    lat: 51.44279778789327,
                    lng: 5.511316016852143,
                  }}
                >
                  <LocationMarker lat={51.44279778789327} lng={5.511316016852143} />
                </GoogleMapReact>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAddListing2;
