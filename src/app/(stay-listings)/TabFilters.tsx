"use client";

import React, { FC, useEffect, useState, useRef, Fragment } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import NcInputNumber from "@/components/NcInputNumber";
import ButtonThird from "@/shared/ButtonThird";
import ButtonClose from "@/shared/ButtonClose";
import Checkbox from "@/shared/Checkbox";
import Slider from "rc-slider";
import convertNumbThousand from "@/utils/convertNumbThousand";
import { fetchAmenities } from '@/api/amenityServices';
import { Amenity } from "@/data/types";

interface TabFiltersProps {
  onFilterChange: (filters: any) => void;
  filters: {
    typeOfStay: string[];
    priceRange: [number, number];
    rooms: { bedrooms: number; beds: number; bathrooms: number };
    amenities: number[];
    propertyType: string[];
  };
}

const formatAmenityName = (name: string) => {
  const specificCases: { [key: string]: string } = {
    'high-speed wifi': 'High-Speed WiFi',
    'tv': 'TV',
    'wardrobe/closet': 'Wardrobe/Closet',
    'air conditioning': 'Air Conditioning',
    'heating': 'Heating',
    'private entrance': 'Private Entrance',
    'coffee & tea facilities': 'Coffee & Tea Facilities',
    'refrigerator & mini bar': 'Refrigerator & Mini Bar',
    'shower & bathtub': 'Shower & Bathtub',
    'essential toiletries': 'Essential Toiletries',
    'swimming pool': 'Swimming Pool',
    'gym access': 'Gym Access',
    'beach access': 'Beach Access',
    'concierge service': 'Concierge Service',
    'luggage assistance': 'Luggage Assistance',
    'baby care facilities': 'Baby Care Facilities',
    'board games & entertainment': 'Board Games & Entertainment',
    'in-room coffee maker': 'In-Room Coffee Maker',
  };

  if (specificCases[name.toLowerCase()]) {
    return specificCases[name.toLowerCase()];
  }

  return name.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const formatTypeOfStayName = (name: string) => {
  return name.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const TabFilters: FC<TabFiltersProps> = ({ onFilterChange, filters }) => {
  const [rangePrices, setRangePrices] = useState<[number, number]>(filters.priceRange);
  const [tempRangePrices, setTempRangePrices] = useState<[number, number]>(filters.priceRange);
  const [beds, setBeds] = useState(filters.rooms.beds);
  const [bedrooms, setBedrooms] = useState(filters.rooms.bedrooms);
  const [bathrooms, setBathrooms] = useState(filters.rooms.bathrooms);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<number>>(new Set(filters.amenities));
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<Set<string>>(new Set(filters.propertyType));
  const [selectedTypesOfStay, setSelectedTypesOfStay] = useState<Set<string>>(new Set(filters.typeOfStay));
  const [isOpenMoreFilter, setIsOpenMoreFilter] = useState(false);
  const [moreFiltersKey, setMoreFiltersKey] = useState(0); // New key state for re-render

  const prevFilters = useRef({
    typeOfStay: Array.from(selectedTypesOfStay),
    priceRange: rangePrices,
    rooms: { bedrooms, beds, bathrooms },
    amenities: Array.from(selectedAmenities),
    propertyType: Array.from(selectedPropertyTypes),
  });

  useEffect(() => {
    const loadAmenities = async () => {
      const fetchedAmenities = await fetchAmenities();
      setAmenities(fetchedAmenities);
    };
    loadAmenities();
  }, []);

  const updateFilters = (updatedRangePrices?: [number, number]) => {
    const finalRangePrices = updatedRangePrices || rangePrices;

    const filters = {
      typeOfStay: Array.from(selectedTypesOfStay),
      priceRange: finalRangePrices,
      rooms: { bedrooms, beds, bathrooms },
      amenities: Array.from(selectedAmenities),
      propertyType: Array.from(selectedPropertyTypes),
    };

    if (JSON.stringify(prevFilters.current) !== JSON.stringify(filters)) {
      prevFilters.current = filters;
      onFilterChange(filters);
    }
  };

  useEffect(() => {
    setSelectedTypesOfStay(new Set(filters.typeOfStay));
  }, [filters.typeOfStay]);

  useEffect(() => {
    updateFilters();
  }, [beds, bedrooms, bathrooms, selectedAmenities, selectedPropertyTypes, selectedTypesOfStay]);

  const handleSliderChange = (newRange: number | number[]) => {
    if (Array.isArray(newRange)) {
      setTempRangePrices(newRange as [number, number]);
    }
  };

  const handleSliderAfterChange = (newRange: number | number[]) => {
    if (Array.isArray(newRange)) {
      setRangePrices(newRange as [number, number]);
      updateFilters(newRange as [number, number]);
    }
  };

  const handleAmenityChange = (amenityId: number, isChecked: boolean) => {
    setSelectedAmenities((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(amenityId);
      } else {
        newSet.delete(amenityId);
      }
      return newSet;
    });
  };

  const handleAmenityChangeWrapper = (name: string, isChecked: boolean) => {
    const amenity = amenities.find(amenity => amenity.name === name);
    if (amenity) {
      handleAmenityChange(amenity.id, isChecked);
    }
  };

  const handlePropertyTypeChange = (propertyType: string, isChecked: boolean) => {
    setSelectedPropertyTypes((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(propertyType);
      } else {
        newSet.delete(propertyType);
      }
      return newSet;
    });
  };

  const handleTypeOfStayChange = (typeOfStay: string, isChecked: boolean) => {
    setSelectedTypesOfStay((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(typeOfStay);
      } else {
        newSet.delete(typeOfStay);
      }
      return newSet;
    });
  };

  const renderFilterItem = (data: { name: string }[], onChange: (name: string, isChecked: boolean) => void, selectedItems: Set<any>) => {
    return (
      <div className="flex flex-col space-y-5">
        {data.map((item) => (
          <Checkbox
            key={item.name}
            name={item.name}
            label={formatAmenityName(item.name)}
            defaultChecked={selectedItems.has(item.name)}
            onChange={(isChecked) => onChange(item.name, isChecked)}
          />
        ))}
      </div>
    );
  };

  const renderTabsTypeOfStay = () => {
    const typeOfStayOptions = [
      { name: "ENTIRE_PLACE" },
      { name: "PRIVATE_ROOM" },
      { name: "HOTEL_ROOM" },
      { name: "SHARED_ROOM" },
    ];

    const selectedCount = selectedTypesOfStay.size;

    return (
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border ${selectedCount > 0 ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'} focus:outline-none`}
            >
              <span>Type of Stay {selectedCount > 0 ? `(${selectedCount})` : ''}</span>
              <i className="las la-angle-down ml-2"></i>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div className="relative flex flex-col px-5 py-6 space-y-5">
                    {typeOfStayOptions.map((item) => (
                      <Checkbox
                        key={item.name}
                        name={item.name}
                        label={formatTypeOfStayName(item.name)}
                        defaultChecked={selectedTypesOfStay.has(item.name)}
                        onChange={(isChecked) => handleTypeOfStayChange(item.name, isChecked)}
                      />
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderTabsRoomAndBeds = () => {
    const selectedCount = [beds, bedrooms, bathrooms].filter(count => count > 0).length;

    return (
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border ${selectedCount > 0 ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'} focus:outline-none`}
            >
              <span>Rooms {selectedCount > 0 ? `(${selectedCount})` : ''}</span>
              <i className="las la-angle-down ml-2"></i>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div className="relative flex flex-col px-5 py-6 space-y-5">
                    <NcInputNumber label="Beds" max={10} defaultValue={beds} onChange={(value) => setBeds(value)} />
                    <NcInputNumber label="Bedrooms" max={10} defaultValue={bedrooms} onChange={(value) => setBedrooms(value)} />
                    <NcInputNumber label="Bathrooms" max={10} defaultValue={bathrooms} onChange={(value) => setBathrooms(value)} />
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderTabsPriceRange = () => {
    return (
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-700 focus:outline-none `}
            >
              <span>{`$${convertNumbThousand(tempRangePrices[0])} - $${convertNumbThousand(tempRangePrices[1])}`}{" "}</span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div className="relative flex flex-col px-5 py-6 space-y-8">
                    <div className="space-y-5">
                      <span className="font-medium">Price Range</span>
                      <Slider
                        range
                        className="text-red-400"
                        min={0}
                        max={2000}
                        value={tempRangePrices}
                        allowCross={false}
                        onChange={handleSliderChange} // Update temporary state on slider change
                        onAfterChange={handleSliderAfterChange} // Update final state on slider release
                      />
                    </div>
                    <div className="flex justify-between space-x-5">
                      <div>
                        <label htmlFor="minPrice" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Min. Price</label>
                        <div className="mt-1 relative rounded-md">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-neutral-500 sm:text-sm">$</span>
                          </div>
                          <input type="text" name="minPrice" disabled id="minPrice" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-200 rounded-full text-neutral-900" value={tempRangePrices[0]} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Max. Price</label>
                        <div className="mt-1 relative rounded-md">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-neutral-500 sm:text-sm">$</span>
                          </div>
                          <input type="text" name="maxPrice" disabled id="maxPrice" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-200 rounded-full text-neutral-900" value={tempRangePrices[1]} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderTabMoreFilter = () => {
    const propertyTypeOptions = [
      { name: "APARTMENT" },
      { name: "HOTEL" },
      { name: "CONDO" },
      { name: "CABIN" },
      { name: "TOWNHOUSE" },
      { name: "PENTHOUSE" },
      { name: "COTTAGE" },
      { name: "BUNGALOW" },
      { name: "LOFT" },
    ];

    const amenityOptions = amenities.map(amenity => ({ name: amenity.name }));

    const handleClearFilters = () => {
      setSelectedAmenities(new Set());
      setSelectedPropertyTypes(new Set());
      setMoreFiltersKey(prevKey => prevKey + 1); // Force re-render of the modal content
    };

    const getAppliedFiltersCount = () => {
      return selectedAmenities.size + selectedPropertyTypes.size;
    };

    return (
      <div>
        <div
          className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-700 focus:outline-none cursor-pointer`}
          onClick={() => setIsOpenMoreFilter(true)}
        >
          <span>More Filters {getAppliedFiltersCount() > 0 ? `(${getAppliedFiltersCount()})` : ''}</span>
        </div>

        <Transition appear show={isOpenMoreFilter} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={() => setIsOpenMoreFilter(false)}
          >
            <div className="min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
              <Transition.Child
                className="inline-block py-8 px-2 h-screen w-full max-w-4xl"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-flex flex-col w-full max-w-4xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full" key={moreFiltersKey}>
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 color-yellow-accent">
                      More filters
                    </Dialog.Title>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={() => setIsOpenMoreFilter(false)} />
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto">
                    <div className="px-10 divide-y divide-neutral-200 dark:divide-neutral-800">
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Property Type</h3>
                        <div className="mt-6 relative ">
                          {renderFilterItem(propertyTypeOptions, handlePropertyTypeChange, selectedPropertyTypes)}
                        </div>
                      </div>
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Amenities</h3>
                        <div className="mt-6 relative ">
                          {renderFilterItem(amenityOptions, handleAmenityChangeWrapper, new Set(Array.from(selectedAmenities).map(id => amenities.find(a => a.id === id)?.name)))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                    <ButtonThird onClick={handleClearFilters} sizeClass="px-4 py-2 sm:px-5">
                      Clear
                    </ButtonThird>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };

  return (
    <div className="flex lg:space-x-4">
      <div className="hidden lg:flex space-x-4">
        {renderTabsTypeOfStay()}
        {renderTabsPriceRange()}
        {renderTabsRoomAndBeds()}
        {renderTabMoreFilter()}
      </div>
    </div>
  );
};

export default TabFilters;
