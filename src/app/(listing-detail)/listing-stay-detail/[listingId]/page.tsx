"use client";

import React, { useEffect, Fragment, useState, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";

import StartRating from "@/components/StartRating";
import Avatar from "@/shared/Avatar";
import Badge from "@/shared/Badge";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonClose from "@/shared/ButtonClose";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Amenities_demos } from "../constant";
import StayDatesRangeInput from "../StayDatesRangeInput";
import GuestsInput from "../GuestsInput";
import SectionDateRange from "../../SectionDateRange";

import { AuthorType, StayDataType } from '@/data/types';
import fetchStayListingById from '@/api/fetchStayListingById';
import fetchAuthorById from "@/api/fetchAuthorById";

const ListingStayDetailPage = () => {
  const pathname = usePathname();
  const [listing, setListing] = useState<StayDataType | null>(null);
  const [author, setAuthor] = useState<AuthorType | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);


    const googleMapsEmbedUrl = useMemo(() => {
      if (!listing) return ""; 
    
      const addressQuery = encodeURIComponent(`${listing.street}, ${listing.postalCode}, ${listing.city}, ${listing.country}`);
    
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyAyXWlzjN4b3X9kQllFwTeJwFVa1Eqhb-8&q=${addressQuery}`;
    }, [listing]);
    
  

    useEffect(() => {
      const id = pathname.split('/').pop();
      if (id) {
        fetchStayListingById(id)
          .then(data => {
            setListing(data);
          // Convert availableDates to Date objects for the DatePicker
          const convertedUnavailableDates = data.availableDates.map(dateStr => new Date(dateStr));
          setUnavailableDates(convertedUnavailableDates);
            // Fetch author details as soon as we have the listing data
            return fetchAuthorById(data.authorId); // Assuming your listing data includes authorId
          })
          .then(authorData => {
            setAuthor(authorData);
          })
          .catch(error => console.error(error));
      }
    }, [pathname]);

  function closeModalAmenities() {
    setIsOpenModalAmenities(false);
  }

  function openModalAmenities() {
    setIsOpenModalAmenities(true);
  }

  if (!listing) return <div>Loading...</div>;

  const address = `${listing.street} ${listing.postalCode}, ${listing.city}, ${listing.country}`;
  


  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        {/* 1 */}
        <div className="flex justify-between items-center">
          <Badge name={listing.propertyType} />
          <LikeSaveBtns />
        </div>

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {listing.title}
        </h2>

        {/* 3 */}
        <div className="flex items-center space-x-4">
          <StartRating />
          <span>·</span>
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1"> {listing.country}, {listing.city}</span>
          </span>
        </div>

        {/* 4 */}
        <div className="flex items-center">
          <Avatar imgUrl={author?.avatar}hasChecked sizeClass="h-10 w-10" radius="rounded-full" />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
            Hosted by{" "}
            <span className="text-neutral-900 dark:text-neutral-200 font-medium">
              {author?.username}
            </span>
          </span>
        </div>

        {/* 5 */}
        <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />

        {/* 6 */}
        <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center space-x-3 ">
            <i className=" las la-user color-yellow-accent text-2xl "></i>
            <span className="">
              {listing.maxGuests} <span className="hidden sm:inline-block">Guests</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className=" las la-bed color-yellow-accent text-2xl"></i>
            <span className=" ">
              {listing.beds} <span className="hidden sm:inline-block">Beds</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className=" las la-bath color-yellow-accent text-2xl"></i>
            <span className=" ">
              {listing.bathrooms} <span className="hidden sm:inline-block">Baths</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className=" las la-door-open color-yellow-accent text-2xl"></i>
            <span className=" ">
              {listing.bedrooms} <span className="hidden sm:inline-block">Bedrooms</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Stay Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="text-neutral-600 dark:text-neutral-300">
        <span>
        {listing.accommodationDescription}
        </span>
      </div>
      </div>
    );
  };

  const renderSection3 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Amenities </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {`The Property's Amenities and Services`}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700 dark:text-neutral-300">
      {listing.amenityNames.map((amenityName) => (
        <div key={amenityName} className="flex items-center space-x-3">
          <i className={`text-3xl color-yellow-accent las la-check-circle`}></i>
          <span>{amenityName}</span>
        </div>
      ))}
    </div>

        {/* ----- */}
        <div className="w-14 border-b border-neutral-200"></div>
        <div>
          <ButtonSecondary onClick={openModalAmenities}>
            View All
          </ButtonSecondary>
        </div>
        {renderMotalAmenities()}
      </div>
    );
  };

  const renderMotalAmenities = () => {
    return (
      <Transition appear show={isOpenModalAmenities} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModalAmenities}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block py-8 h-screen w-full max-w-4xl">
                <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <h3
                      className="text-lg font-medium leading-6 color-yellow-accent"
                      id="headlessui-dialog-title-70"
                    >
                      Amenities
                    </h3>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalAmenities} />
                    </span>
                  </div>
                  <div className="px-8 overflow-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    {Amenities_demos.filter((_, i) => i < 1212).map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center py-2.5 sm:py-4 lg:py-5 space-x-5 lg:space-x-8"
                      >
                        <i
                          className={`text-4xl color-yellow-accent las ${item.icon}`}
                        ></i>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  const renderSection4 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Room Rates </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Rates are subject to change during weekends and holiday periods
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* CONTENT */}
        <div className="flow-root">
          <div className="text-sm sm:text-base text-neutral-6000 dark:text-neutral-300 -mb-4">
            <div className="p-4 bg-neutral-100 dark:color-yellow-background flex justify-between items-center space-x-4 rounded-lg">
              <span>Monday - Thursday</span>
              <span>${listing.weekdayPrice}</span>
            </div>
            <div className="p-4  flex justify-between items-center space-x-4 rounded-lg">
            <span>Friday - Sunday</span>
              <span>${listing.weekendPrice}</span>
            </div>
            <div className="p-4 bg-neutral-100 dark:color-yellow-background flex justify-between items-center space-x-4 rounded-lg">
              <span>Rent by Month</span>
              <span>-{listing.longTermStayDiscount} %</span>
            </div>
            <div className="p-4  flex justify-between items-center space-x-4 rounded-lg">
              <span>Min. Number of Nights</span>
              <span>{listing.minimumNights} Night/s</span>
            </div>
            <div className="p-4 bg-neutral-100 dark:color-yellow-background flex justify-between items-center space-x-4 rounded-lg">
              <span>Max. Number of Nights</span>
              <span>{listing.maximumNights} Night/s</span>
            </div>
          </div>
          <br></br>
        </div>
      </div>
    );
  };

  
  const renderSection5 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Things to Know</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">Cancellation Policy</h4>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
          Customers will receive a 50% refund of the booking value if they cancel the reservation within 48 hours of a successful booking and at least 14 days prior to the scheduled check-in time. <br /> <br/>
          Furthermore, if a reservation is canceled at least 14 days before the check-in date, guests are eligible for a 50% refund of the total amount paid, excluding the service fee.
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">Be Sure To:</h4>
          <div className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-md text-sm sm:text-base">
            <div className="flex space-x-10 justify-between p-3 bg-neutral-100 dark:color-yellow-background rounded-lg">
              <span>Check-in</span>
              <span>{listing.checkInHours}</span>
            </div>
            <div className="flex space-x-10 justify-between p-3">
              <span>Check-out</span>
              <span>{listing.checkOutHours}</span>
            </div>
          </div>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">Special Notes</h4>
          <div className="prose sm:prose">
          <ul className="mt-3 text-neutral-500 dark:text-neutral-400 space-y-2">
          <li>
          {listing.specialRestrictions}
          </li>
        </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Location</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {address}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* MAP */}
        <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3 ring-1 ring-black/10 rounded-xl z-0">
          <div className="rounded-xl overflow-hidden z-0">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={googleMapsEmbedUrl} 
            ></iframe>
          </div>
        </div>
      </div>
    );
  };

  const renderSection7 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Host Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* host */}
        <div className="flex items-center space-x-4">
          <Avatar
            hasChecked
            hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
            sizeClass="h-14 w-14"
            radius="rounded-full"
            imgUrl={author?.avatar}
            width={56}
            height={56}
          />
          <div>
            <a className="block text-xl font-medium" href="##">
              {author?.username}
            </a>
            <div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
              <StartRating point={author?.starRating}/>
              <span className="mx-2">·</span>
              <span> {author?.count}</span>
            </div>
          </div>
        </div>

        {/* desc */}
        <span className="block text-neutral-6000 dark:text-neutral-300">
        {author?.description}
        </span>

        {/* info */}
        <div className="block text-neutral-500 dark:text-neutral-400 space-y-2.5">
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Joined in March 2024</span>
          </div>
        </div>

        {/* == */}
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div>
          <ButtonSecondary href="/author">See Host Profile</ButtonSecondary>
        </div>
      </div>
    );
  };

  // const renderSection8 = () => {
  //   return (
  //     <div className="listingSection__wrap">
  //       {/* HEADING */}
  //       <h2 className="text-2xl font-semibold">Reviews (23 reviews)</h2>
  //       <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

  //       {/* Content */}
  //       <div className="space-y-5">
  //         <FiveStartIconForRate iconClass="w-6 h-6" className="space-x-0.5" />
  //         <div className="relative">
  //           <Input
  //             fontClass=""
  //             sizeClass="h-16 px-4 py-3"
  //             rounded="rounded-3xl"
  //             placeholder="Share your thoughts ..."
  //           />
  //           <ButtonCircle
  //             className="absolute right-2 top-1/2 transform -translate-y-1/2"
  //             size=" w-12 h-12 "
  //           >
  //             <ArrowRightIcon className="w-5 h-5" />
  //           </ButtonCircle>
  //         </div>
  //       </div>

  //       {/* comment */}
  //       <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
  //         <CommentListing className="py-8" />
  //         <CommentListing className="py-8" />
  //         <CommentListing className="py-8" />
  //         <CommentListing className="py-8" />
  //         <div className="pt-8">
  //           <ButtonSecondary>View More Reviews</ButtonSecondary>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const renderSidebar = () => {
    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        {/* PRICE */}
        <div className="flex justify-between">
          <span className="text-3xl font-semibold">
            ${listing.weekdayPrice}
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              /Night
            </span>
          </span>
          <StartRating />
        </div>

        {/* FORM */}
        <form className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl ">
          <StayDatesRangeInput className="flex-1 z-[11]" />
          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
          <GuestsInput className="flex-1" />
        </form>

        {/* SUM */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>${listing.weekdayPrice} x 3 Night/s</span>
            <span>$75</span>
          </div>
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Service Charge</span>
            <span>$0</span>
          </div>
          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>$75</span>
          </div>
        </div>

        {/* SUBMIT */}
        <ButtonPrimary href={"/checkout"}>Reserve</ButtonPrimary>
      </div>
    );
  };

  return (
    <div className="nc-ListingStayDetailPage">
      {/*  HEADER */}
      <header className="rounded-md sm:rounded-xl">
        <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
          {listing && listing.galleryImageUrls.length > 0 && (
            <div
              className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
            >
              <Image
                fill
                className="object-cover rounded-md sm:rounded-xl"
                src={listing.galleryImageUrls[0]}
                alt=""
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              />
              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
          )}
          {listing &&
            listing.galleryImageUrls.filter((_, i) => i >= 1 && i < 5).map((item, index) => (
              <div
                key={index}
                className={`relative rounded-md sm:rounded-xl overflow-hidden ${index >= 3 ? "hidden sm:block" : ""}`}
              >
                <div className="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5">
                  <Image
                    fill
                    className="object-cover rounded-md sm:rounded-xl "
                    src={item || ""}
                    alt=""
                    sizes="400px"
                  />
                </div>
                {/* OVERLAY */}
                <div
                  className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                />
              </div>
            ))}
        </div>
      </header>

      {/* MAIN */}
      <main className=" relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
          {renderSection1()}
          {renderSection2()}
          {renderSection3()}
          {renderSection4()}
          <SectionDateRange additionalUnavailableDates={unavailableDates} />
          {renderSection5()}
          {renderSection6()}
          {renderSection7()}
          {/* {renderSection8()} */}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">{renderSidebar()}</div>
        </div>
      </main>
    </div>
  );
};

export default ListingStayDetailPage;
