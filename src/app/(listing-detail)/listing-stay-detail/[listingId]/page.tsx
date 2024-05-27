"use client"
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import StartRating from "@/components/StartRating";
import Avatar from "@/shared/Avatar";
import Badge from "@/shared/Badge";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonClose from "@/shared/ButtonClose";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import EditButton from "@/components/EditButton";
import DeleteButton from "@/components/DeleteButton";
import StayDatesRangeInput from "../StayDatesRangeInput";
import GuestsInput from "../GuestsInput";
import SectionDateRange from "../../SectionDateRange";
import { AuthorType, StayDataType } from '@/data/types';
import fetchStayListingById from '@/api/fetchStayListingById';
import fetchAuthorById from "@/api/fetchAuthorById";
import { deleteStayListing } from "@/api/stayServices";
import { useAuth } from '@/contexts/authContext';
import type { Route } from "@/routers/types";

const ListingStayDetailPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<StayDataType | null>(null);
  const [author, setAuthor] = useState<AuthorType | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
  const [isOpenModalImageGallery, setIsOpenModalImageGallery] = useState(false);

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
          const convertedUnavailableDates = data.availableDates.map(dateStr => new Date(dateStr));
          setUnavailableDates(convertedUnavailableDates);
          return fetchAuthorById(data.authorId);
        })
        .then(authorData => {
          setAuthor(authorData);
        })
        .catch(error => console.error(error));
    }
  }, [pathname]);

  const handleOpenModalImageGallery = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("modal", "PHOTO_TOUR_SCROLLABLE");
    router.push(`${pathname}?${params.toString()}` as unknown as Route);
  };

  const handleCloseModalImageGallery = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("modal");
    router.push(`${pathname}?${params.toString()}` as unknown as Route);
  };

  const closeModalAmenities = () => setIsOpenModalAmenities(false);
  const openModalAmenities = () => setIsOpenModalAmenities(true);

  const handleEditListing = () => {
    if (listing) {
      sessionStorage.setItem('listingFormData', JSON.stringify(listing));
      sessionStorage.setItem('originalAuthorId', listing.authorId.toString());
      router.push(`/add-listing/1`);
    }
  };

  const handleDeleteListing = async () => {
    if (listing) {
      const confirmDelete = confirm("Are you sure you want to delete this listing?");
      if (confirmDelete) {
        try {
          await deleteStayListing(listing.id.toString());
          router.push("/");
        } catch (error) {
          console.error("Failed to delete listing:", error);
        }
      }
    }
  };

  const isUserAuthorized = user && (user.id === listing?.authorId || user.role === "FOUNDER");

  if (!listing) return <div>Loading...</div>;

  const address = `${listing.street} ${listing.postalCode}, ${listing.city}, ${listing.country}`;

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        <div className="flex justify-between items-center">
          <Badge name={listing.propertyType} />
          <div className="flex items-center space-x-3">
            <LikeSaveBtns listingId={listing.id} />
            {isUserAuthorized && (
              <>
                <EditButton onClick={handleEditListing} />
                <DeleteButton onClick={handleDeleteListing} />
              </>
            )}
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {listing.title}
        </h2>
        <div className="flex items-center space-x-4">
          <StartRating />
          <span>·</span>
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1"> {listing.country}, {listing.city}</span>
          </span>
        </div>
        <div className="flex items-center">
          <Avatar imgUrl={author?.avatar} hasChecked sizeClass="h-10 w-10" radius="rounded-full" />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
            Hosted by{" "}
            <span className="text-neutral-900 dark:text-neutral-200 font-medium">
              {author?.username}
            </span>
          </span>
        </div>
        <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />
        <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          {listing.maxGuests && (
            <div className="flex items-center space-x-3">
              <i className="las la-user color-yellow-accent text-2xl"></i>
              <span>
                {listing.maxGuests} <span className="hidden sm:inline-block">{listing.maxGuests === 1 ? "Guest" : "Guests"}</span>
              </span>
            </div>
          )}
          {listing.beds && (
            <div className="flex items-center space-x-3">
              <i className="las la-bed color-yellow-accent text-2xl"></i>
              <span>
                {listing.beds} <span className="hidden sm:inline-block">{listing.beds === 1 ? "Bed" : "Beds"}</span>
              </span>
            </div>
          )}
          {listing.bathrooms && (
            <div className="flex items-center space-x-3">
              <i className="las la-bath color-yellow-accent text-2xl"></i>
              <span>
                {listing.bathrooms} <span className="hidden sm:inline-block">{listing.bathrooms === 1 ? "Bath" : "Baths"}</span>
              </span>
            </div>
          )}
          {listing.bedrooms && (
            <div className="flex items-center space-x-3">
              <i className="las la-door-open color-yellow-accent text-2xl"></i>
              <span>
                {listing.bedrooms} <span className="hidden sm:inline-block">{listing.bedrooms === 1 ? "Bedroom" : "Bedrooms"}</span>
              </span>
            </div>
          )}
          {listing.kitchens && (
            <div className="flex items-center space-x-3">
              <i className="las la-utensils color-yellow-accent text-2xl"></i>
              <span>
                {listing.kitchens} <span className="hidden sm:inline-block">{listing.kitchens === 1 ? "Kitchen" : "Kitchens"}</span>
              </span>
            </div>
          )}
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
          <span>{listing.accommodationDescription}</span>
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700 dark:text-neutral-300">
          {listing.amenityNames.map((amenityName) => (
            <div key={amenityName} className="flex items-center space-x-3">
              <i className={`text-3xl color-yellow-accent las la-check-circle`}></i>
              <span>{amenityName}</span>
            </div>
          ))}
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
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
      <Transition appear show={isOpenModalAmenities} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModalAmenities}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={React.Fragment}
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
                    <h3 className="text-lg font-medium leading-6 color-yellow-accent" id="headlessui-dialog-title-70">
                      Amenities
                    </h3>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalAmenities} />
                    </span>
                  </div>
                  <div className="px-8 overflow-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {listing.amenityNames.map((amenityName) => (
                      <div key={amenityName} className="flex items-center py-2.5 sm:py-4 lg:py-5 space-x-5 lg:space-x-8">
                        <i className={`text-4xl color-yellow-accent las la-check-circle`}></i>
                        <span>{amenityName}</span>
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
    const formatNights = (nights: number | null): string => {
      if (nights === null) return "Not specified";
      return `${nights} Night${nights === 1 ? '' : 's'}`;
    };
  
    const formatDiscount = (discount: number | null): string => {
      if (discount === null || discount === 0) return "Not specified";
      return `-${discount} %`;
    };
  
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Room Rates </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Rates are subject to change during weekends and holiday periods
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="flow-root">
          <div className="text-sm sm:text-base text-neutral-6000 dark:text-neutral-300 -mb-4">
            <div className="p-4 bg-neutral-100 dark:color-yellow-background flex justify-between items-center space-x-4 rounded-lg">
              <span>Monday - Thursday</span>
              <span>${listing.weekdayPrice}</span>
            </div>
            <div className="p-4 flex justify-between items-center space-x-4 rounded-lg">
              <span>Friday - Sunday</span>
              <span>${listing.weekendPrice}</span>
            </div>
            <div className="p-4 bg-neutral-100 dark:color-yellow-background flex justify-between items-center space-x-4 rounded-lg">
              <span>Discount by Month</span>
              <span>{formatDiscount(listing.longTermStayDiscount)}</span>
            </div>
            <div className="p-4 flex justify-between items-center space-x-4 rounded-lg">
              <span>Min. Number of Nights</span>
              <span>{formatNights(listing.minimumNights)}</span>
            </div>
            <div className="p-4 bg-neutral-100 dark:color-yellow-background flex justify-between items-center space-x-4 rounded-lg">
              <span>Max. Number of Nights</span>
              <span>{formatNights(listing.maximumNights)}</span>
            </div>
          </div>
          <br />
        </div>
      </div>
    );
  };
  
  

  const renderSection5 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Things to Know</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
        <div>
          <h4 className="text-lg font-semibold">Cancellation Policy</h4>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            Customers will receive a 50% refund of the booking value if they cancel the reservation within 48 hours of a successful booking and at least 14 days prior to the scheduled check-in time.
            <br />
            <br />
            Furthermore, if a reservation is canceled at least 14 days before the check-in date, guests are eligible for a 50% refund of the total amount paid, excluding the service fee.
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
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
        <div>
          <h4 className="text-lg font-semibold">Special Notes</h4>
          <div className="prose sm:prose">
            <ul className="mt-3 text-neutral-500 dark:text-neutral-400 space-y-2">
              {listing.specialRestrictions && listing.specialRestrictions.length > 0 ? (
                listing.specialRestrictions.map((restriction, index) => (
                  <li key={index}>{restriction}</li>
                ))
              ) : (
                <li>None specified.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };


  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Location</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {address}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
        <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3 ring-1 ring-black/10 rounded-xl z-0">
          <div className="rounded-xl overflow-hidden z-0">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={googleMapsEmbedUrl}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSection7 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Host Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
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
              <StartRating point={author?.starRating} />
              <span className="mx-2">·</span>
              <span> {author?.count}</span>
            </div>
          </div>
        </div>
        <span className="block text-neutral-6000 dark:text-neutral-300">
          {author?.description}
        </span>
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
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
        <div>
          <ButtonSecondary href="/author">See Host Profile</ButtonSecondary>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        <div className="flex justify-between">
          <span className="text-3xl font-semibold">
            ${listing.weekdayPrice}
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              /Night
            </span>
          </span>
          <StartRating />
        </div>
        <form className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl ">
          <StayDatesRangeInput className="flex-1 z-[11]" />
          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
          <GuestsInput className="flex-1" />
        </form>
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
        <ButtonPrimary href={"/checkout"}>Reserve</ButtonPrimary>
      </div>
    );
  };

   return (
    <div className="nc-ListingStayDetailPage">
      <header className="rounded-md sm:rounded-xl">
        <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
          {listing && listing.galleryImageUrls.length > 0 && (
            <div
              className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
              onClick={handleOpenModalImageGallery}
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
                    className="object-cover rounded-md sm:rounded-xl"
                    src={item}
                    alt=""
                    sizes="400px"
                  />
                </div>
                <div
                  className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleOpenModalImageGallery}
                />
              </div>
            ))}
          <button
            className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-nav text-neutral-500 hover:bg-neutral-200 z-10"
            onClick={handleOpenModalImageGallery}
          >
            <Squares2X2Icon className="w-5 h-5" />
            <span className="ml-2 text-neutral-800 text-sm font-medium">
              Show All Photos
            </span>
          </button>
        </div>
      </header>
      <main className="relative z-10 mt-11 flex flex-col lg:flex-row">
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
          {renderSection1()}
          {renderSection2()}
          {renderSection3()}
          {renderSection4()}
          <SectionDateRange additionalUnavailableDates={unavailableDates} />
          {renderSection5()}
          {renderSection6()}
          {renderSection7()}
        </div>
        <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">{renderSidebar()}</div>
        </div>
      </main>
    </div>
  );
};

export default ListingStayDetailPage;
