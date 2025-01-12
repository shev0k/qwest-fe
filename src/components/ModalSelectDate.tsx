"use client";

import DatePicker from "react-datepicker";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { FC, Fragment, useEffect, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import DatePickerCustomHeaderTwoMonth from "./DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "./DatePickerCustomDay";

interface ModalSelectDateProps {
  renderChildren?: (p: { openModal: () => void }) => React.ReactNode;
}

const ModalSelectDate: FC<ModalSelectDateProps> = ({ renderChildren }) => {
  const [showModal, setShowModal] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const reservationDetails = JSON.parse(
      localStorage.getItem("reservationDetails") || "{}"
    );
    setStartDate(
      reservationDetails.checkInDate
        ? new Date(reservationDetails.checkInDate)
        : null
    );
    setEndDate(
      reservationDetails.checkOutDate
        ? new Date(reservationDetails.checkOutDate)
        : null
    );
  }, []);

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // Save updated dates to localStorage
    const reservationDetails = JSON.parse(
      localStorage.getItem("reservationDetails") || "{}"
    );
    reservationDetails.checkInDate = start
      ? start.toISOString().split("T")[0]
      : null;
    reservationDetails.checkOutDate = end
      ? end.toISOString().split("T")[0]
      : null;
    localStorage.setItem("reservationDetails", JSON.stringify(reservationDetails));
  };

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const renderButtonOpenModal = () => {
    return renderChildren ? (
      renderChildren({ openModal })
    ) : (
      <button onClick={openModal}>Select Date</button>
    );
  };

  return (
    <>
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="HeroSearchFormMobile__Dialog relative z-50"
          onClose={closeModal}
        >
          <div className="fixed inset-0 bg-neutral-nav dark:bg-neutral-900">
            <div className="flex h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out transition-transform"
                enterFrom="opacity-0 translate-y-52"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in transition-transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-52"
              >
                <Dialog.Panel className="relative h-full overflow-hidden flex-1 flex flex-col justify-between ">
                  <>
                    <div className="absolute left-4 top-4">
                      <button
                        className="focus:outline-none focus:ring-0"
                        onClick={closeModal}
                      >
                        <XMarkIcon className="w-5 h-5 text-black dark:text-white" />
                      </button>
                    </div>

                    <div className="flex h-screen justify-center items-center overflow-auto pt-12 p-1 bg-white dark:bg-neutral-800">
                      <div className="flex flex-col items-center">
                        <div className="p-5">
                          <span className="block font-semibold text-xl sm:text-2xl">
                            When&apos;s your trip?
                          </span>
                        </div>
                        <div className="overflow-hidden rounded-3xl">
                          <DatePicker
                            selected={startDate}
                            onChange={onChangeDate}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            monthsShown={2}
                            showPopperArrow={false}
                            inline
                            renderCustomHeader={(p) => (
                              <DatePickerCustomHeaderTwoMonth {...p} />
                            )}
                            renderDayContents={(day, date) => (
                              <DatePickerCustomDay dayOfMonth={day} date={date} />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
                      <button
                        type="button"
                        className="underline font-semibold flex-shrink-0"
                        onClick={() => {
                          onChangeDate([null, null]);
                        }}
                      >
                        Clear dates
                      </button>
                      <ButtonPrimary
                        sizeClass="px-6 py-3 !rounded-xl"
                        onClick={closeModal}
                      >
                        Save
                      </ButtonPrimary>
                    </div>
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalSelectDate;
