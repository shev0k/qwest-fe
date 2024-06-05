"use client";

import React, { Fragment, useState, useEffect, FC } from "react";
import { Popover, Transition } from "@headlessui/react";
import NcInputNumber from "@/components/NcInputNumber";
import ClearDataButton from "./ClearDataButton";
import { UserPlusIcon } from "@heroicons/react/24/outline";

export interface GuestsObject {
  guestAdults: number;
  guestChildren: number;
  guestInfants: number;
}

export interface GuestsInputProps {
  fieldClassName?: string;
  className?: string;
  onChange?: (totalGuests: GuestsObject) => void;
  value?: GuestsObject;
}

const GuestsInput: FC<GuestsInputProps> = ({
  fieldClassName = "[ nc-hero-field-padding ]",
  className = "[ nc-flex-1 ]",
  onChange,
  value = { guestAdults: 1, guestChildren: 0, guestInfants: 0 },
}) => {
  const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(value.guestAdults || 1);
  const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(value.guestChildren || 0);
  const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(value.guestInfants || 0);

  useEffect(() => {
    setGuestAdultsInputValue(value.guestAdults || 1);
    setGuestChildrenInputValue(value.guestChildren || 0);
    setGuestInfantsInputValue(value.guestInfants || 0);
  }, [value]);

  const handleChangeData = (newValue: number, type: keyof GuestsObject) => {
    let updatedValues = {
      guestAdults: guestAdultsInputValue,
      guestChildren: guestChildrenInputValue,
      guestInfants: guestInfantsInputValue,
    };

    if (type === "guestAdults") {
      setGuestAdultsInputValue(newValue);
      updatedValues.guestAdults = newValue;
    } else if (type === "guestChildren") {
      setGuestChildrenInputValue(newValue);
      updatedValues.guestChildren = newValue;
    } else if (type === "guestInfants") {
      setGuestInfantsInputValue(newValue);
      updatedValues.guestInfants = newValue;
    }

    onChange && onChange(updatedValues);
  };

  const totalGuests = guestChildrenInputValue + guestAdultsInputValue + guestInfantsInputValue;

  return (
    <Popover className={`flex relative ${className}`}>
      {({ open }) => (
        <>
          <div
            className={`flex-1 z-10 flex items-center focus:outline-none ${open ? "nc-hero-field-focused" : ""}`}
          >
            <Popover.Button
              className={`relative z-10 flex-1 flex text-left items-center ${fieldClassName} space-x-3 focus:outline-none`}
            >
              <div className="color-yellow-accent dark:color-yellow-accent">
                <UserPlusIcon className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="flex-grow">
                <span className="block xl:text-lg font-semibold">
                  {totalGuests || ""} Guests
                </span>
                <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
                  {totalGuests ? "Guests" : "Add Guests"}
                </span>
              </div>

              {!!totalGuests && open && (
                <ClearDataButton
                  onClick={() => {
                    setGuestAdultsInputValue(1);
                    setGuestChildrenInputValue(0);
                    setGuestInfantsInputValue(0);
                  }}
                />
              )}
            </Popover.Button>
          </div>

          {open && (
            <div className="h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -left-0.5 right-0.5 bg-white dark:bg-neutral-800"></div>
          )}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-10 w-full sm:min-w-[340px] max-w-sm bg-white dark:bg-neutral-800 top-full mt-3 py-5 sm:py-6 px-4 sm:px-8 rounded-3xl shadow-xl">
              <NcInputNumber
                className="w-full"
                defaultValue={guestAdultsInputValue}
                onChange={(value) => handleChangeData(value, "guestAdults")}
                max={10}
                min={1}
                label="Adults"
                desc="Ages 13 or Above"
              />
              <NcInputNumber
                className="w-full mt-6"
                defaultValue={guestChildrenInputValue}
                onChange={(value) => handleChangeData(value, "guestChildren")}
                max={100}
                label="Children"
                desc="Ages 2–12"
              />
              <NcInputNumber
                className="w-full mt-6"
                defaultValue={guestInfantsInputValue}
                onChange={(value) => handleChangeData(value, "guestInfants")}
                max={100}
                label="Infants"
                desc="Ages 0–2"
              />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default GuestsInput;
