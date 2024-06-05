"use client";

import { Tab } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import React, { Fragment, FC, useEffect, useState } from "react";
import visaPng from "@/images/vis.png";
import mastercardPng from "@/images/mastercard.svg";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import ButtonPrimary from "@/shared/ButtonPrimary";
import StartRating from "@/components/StartRating";
import NcModal from "@/shared/NcModal";
import Image from "next/image";
import { createReservation } from '@/api/reservation';
import { GuestsObject } from "../(client-components)/type";
import ExpirationDateInput from "@/components/ExpirationDateInput";
import fetchStayListingById from "@/api/fetchStayListingById";
import { eachDayOfInterval, addDays, isWeekend, isFriday } from "date-fns";
import { useRouter } from "next/navigation";
import converSelectedDateToString from "@/utils/converSelectedDateToString";
import { useAuth } from "@/contexts/authContext";
import { ReservationDTO } from '@/data/types';
import withReservationGuard from '@/components/withReservationGuard';
import Modal from "@/components/Modal";  // Add this import

export interface CheckOutPagePageMainProps {
  className?: string;
}

const CheckOutPagePageMain: FC<CheckOutPagePageMainProps> = ({ className = "" }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<GuestsObject>({
    guestAdults: 1,
    guestChildren: 0,
    guestInfants: 0,
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [listing, setListing] = useState<any>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "message" as "message" | "confirm",
    message: "",
    onConfirm: () => setModal({ ...modal, isOpen: false }),
    onCancel: () => setModal({ ...modal, isOpen: false }),
  });

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const reservationDetails = JSON.parse(localStorage.getItem("reservationDetails") || "{}");
    setStartDate(reservationDetails.checkInDate ? new Date(reservationDetails.checkInDate) : null);
    setEndDate(reservationDetails.checkOutDate ? new Date(reservationDetails.checkOutDate) : null);
    setGuests({
      guestAdults: reservationDetails.adults || 1,
      guestChildren: reservationDetails.children || 0,
      guestInfants: reservationDetails.infants || 0
    });
    setTotalPrice(reservationDetails.totalPrice || 0);
    setAvailableDates(reservationDetails.availableDates || []);
    setSelectedDates(reservationDetails.selectedDates || []);
  
    if (reservationDetails.stayListingId) {
      fetchStayListingById(reservationDetails.stayListingId).then(setListing);
    } else {
      console.warn('No stay listing ID found in reservation details.');
    }
  }, []);
  

  const formatGuests = (adults: number = 0, children: number = 0, infants: number = 0) => {
    const formattedAdults = `${adults} Adult${adults !== 1 ? 's' : ''}`;
    const formattedChildren = `${children} Child${children !== 1 ? 'ren' : ''}`;
    const formattedInfants = `${infants} Infant${infants !== 1 ? 's' : ''}`;
  
    return `${formattedAdults}, ${formattedChildren}, ${formattedInfants}`;
  };
  

  const handleConfirmAndPay = async () => {
    if (!user) {
      setModal({
        isOpen: true,
        type: "message",
        message: "You need to be logged in to complete the payment.",
        onConfirm: () => router.push('/login'),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return;
    }

    // Perform card validation
    const cardNumberInput = (document.getElementById("cardNumber") as HTMLInputElement).value;
    const cardNumber = cardNumberInput.replace(/\s/g, ''); // Remove spaces for validation
    const cardHolder = (document.getElementById("cardHolder") as HTMLInputElement).value;
    const expirationDate = (document.getElementById("expirationDate") as HTMLInputElement).value;
    const cvc = (document.getElementById("cvc") as HTMLInputElement).value;

    const cardNumberRegex = /^[0-9]{16}$/;
    const cardHolderRegex = /^[A-Za-z\s]+$/;
    const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvcRegex = /^[0-9]{3}$/;

    if (!cardNumberRegex.test(cardNumber)) {
      setModal({
        isOpen: true,
        type: "message",
        message: "Invalid card number",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return;
    }
    if (!cardHolderRegex.test(cardHolder)) {
      setModal({
        isOpen: true,
        type: "message",
        message: "Invalid card holder name",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return;
    }
    if (!expirationDateRegex.test(expirationDate)) {
      setModal({
        isOpen: true,
        type: "message",
        message: "Invalid expiration date",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return;
    }
    if (!cvcRegex.test(cvc)) {
      setModal({
        isOpen: true,
        type: "message",
        message: "Invalid CVC",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return;
    }

    const bookingCode = generateBookingCode();

    const reservationDetails: ReservationDTO = {
      authorId: user.id,
      stayListingId: listing.id,
      checkInDate: startDate?.toISOString().split("T")[0] || "",
      checkOutDate: endDate?.toISOString().split("T")[0] || "",
      adults: guests.guestAdults ?? 0,
      children: guests.guestChildren ?? 0,
      infants: guests.guestInfants ?? 0,
      totalPrice: totalPrice ?? 0,
      bookingCode,
      cancelled: false,
      selectedDates: selectedDates,
    };

    try {
      const newReservation = await createReservation(reservationDetails);
      reservationDetails.id = newReservation.id;
      localStorage.setItem('reservationDetails', JSON.stringify(reservationDetails)); 
      router.push("/pay-done");
    } catch (error) {
      console.error("Failed to create reservation:", error);
      setModal({
        isOpen: true,
        type: "message",
        message: "Failed to create reservation. Please try again.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
    }
  };

  const generateBookingCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 9; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19);
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    e.target.value = formatCardNumber(value);
  };
  
  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    e.target.value = value.replace(/[^a-zA-Z\s]/g, '');
  };
  
  const formatExpirationDate = (value: string) => {
    return value
      .replace(/^([1-9]\/|[2-9])$/g, '0$1') // 3 -> 03
      .replace(/^(0[1-9]|1[0-2])$/g, '$1/') // 11 -> 11/
      .replace(/^([0-1])([3-9])$/g, '0$1/$2') // 13 -> 01/3
      .replace(/^(0[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2') // 11/11 -> 11/11
      .replace(/[^\d\/]|^[\/]*$/g, '') // Prevent entering non-numeric characters
      .substring(0, 5); // Limit to 5 characters (MM/YY)
  };
  

  const formatCVC = (value: string) => {
    return value.replace(/[^\d]/g, '').slice(0, 3); // Limit to 3 digits
  };
  

  const renderSidebar = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl lg:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="flex-shrink-0 w-full sm:w-40">
            <div className="aspect-w-4 aspect-h-3 sm:aspect-h-4 rounded-2xl overflow-hidden">
              <Image
                alt=""
                fill
                sizes="200px"
                src={
                  listing?.featuredImage ||
                  "https://images.pexels.com/photos/6373478/pexels-photo-6373478.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                }
              />
            </div>
          </div>
          <div className="py-5 sm:px-5 space-y-3">
            <div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                {listing?.country}
              </span>
              <span className="text-base font-medium mt-1 block">
                {listing?.title}
              </span>
            </div>
            <div className="w-10 border-b border-neutral-200 dark:border-neutral-700"></div>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">Price Details</h3>
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>
              ${listing?.weekdayPrice} x{" "}
              {Math.floor(
                (new Date(endDate || "").getTime() -
                  new Date(startDate || "").getTime()) /
                  (1000 * 3600 * 24)
              )}{" "}
              Night/s
            </span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Service Charge</span>
            <span>$0</span>
          </div>

          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderMain = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-8 px-0 sm:p-6 xl:p-8">
        <h2 className="text-3xl lg:text-4xl font-semibold">
          Confirm and Payment
        </h2>
        <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
        <div>
          <div>
            <h3 className="text-2xl font-semibold">Your Trip</h3>
            <div className="mt-6 border border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700 overflow-hidden z-10">
              <div className="text-left flex-1 p-5 flex justify-between space-x-5">
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-400">Date</span>
                  <span className="mt-1.5 text-lg font-semibold">
                    {converSelectedDateToString([startDate, endDate])}
                  </span>
                </div>
              </div>

              <div className="text-left flex-1 p-5 flex justify-between space-x-5">
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-400">Guests</span>
                  <span className="mt-1.5 text-lg font-semibold">
                  <span className="mt-1.5 text-lg font-semibold">
                  {formatGuests(guests.guestAdults, guests.guestChildren, guests.guestInfants)}
                  </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">Pay Via</h3>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 my-5"></div>

          <div className="mt-6">
            <Tab.Group>
              <Tab.List className="flex my-5 gap-1">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`px-4 py-1.5 sm:px-6 sm:py-2.5  rounded-full flex items-center justify-center focus:outline-none  ${selected
                        ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900"
                        : " text-neutral-6000 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                    >
                      <span className="mr-2.5">Card</span>
                      <Image className="w-8" src={visaPng} alt="visa" />
                      <Image
                        className="w-8"
                        src={mastercardPng}
                        alt="mastercard"
                      />
                    </button>
                  )}
                </Tab>
              </Tab.List>

              <Tab.Panels>
              <Tab.Panel className="space-y-5">
              <div className="space-y-1">
                <Label>Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 1234 1234 1234"
                  onChange={handleCardNumberChange}
                />
              </div>
              <div className="space-y-1">
                <Label>Card Holder</Label>
                <Input
                  id="cardHolder"
                  placeholder="John Doe"
                  onChange={handleCardHolderChange}
                />
              </div>
              <div className="flex space-x-5">
                <div className="flex-1 space-y-1">
                  <Label>Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    placeholder="MM/YY"
                    onChange={(e) => e.target.value = formatExpirationDate(e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label>CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="CVC"
                    onChange={(e) => e.target.value = formatCVC(e.target.value)}
                  />
                </div>
              </div>

              </Tab.Panel>
            </Tab.Panels>


            </Tab.Group>
            <div className="pt-8">
              <ButtonPrimary onClick={handleConfirmAndPay}>
                Confirm and Pay
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-CheckOutPagePageMain ${className}`}>
      <main className="container mt-11 mb-24 lg:mb-32 flex flex-col-reverse lg:flex-row">
      <div className="w-full lg:w-3/5 xl:w-2/3 lg:pr-10">{renderMain()}</div>
        <div className="hidden lg:block flex-grow">{renderSidebar()}</div>
      </main>
      <Modal
        type={modal.type}
        message={modal.message}
        isOpen={modal.isOpen}
        onClose={modal.onCancel}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </div>
  );
};

export default withReservationGuard(CheckOutPagePageMain);
