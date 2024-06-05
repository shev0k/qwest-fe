"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Tab } from "@headlessui/react";
import StayCard from "@/components/StayCard";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { useAuth } from '@/contexts/authContext';
import { useReservations } from '@/contexts/ReservationContext';
import { StayDataType, ReservationDTO } from "@/data/types";
import { useRouter } from 'next/navigation';
import fetchStayListingById from "@/api/fetchStayListingById";
import Modal from '@/components/Modal';

const AccountReservations = () => {
  const { user, loginUser } = useAuth();
  const { reservations, fetchUserReservations, cancelUserReservation, deleteAllCanceledReservations } = useReservations();
  const [stayData, setStayData] = useState<Record<number, StayDataType>>({});
  const [categories] = useState(["Stays"]);
  const [showAllReservations, setShowAllReservations] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "message" as "message" | "confirm",
    message: "",
    onConfirm: () => setModal({ ...modal, isOpen: false }),
    onCancel: () => setModal({ ...modal, isOpen: false }),
  });
  const router = useRouter();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');

    if (storedUserData && storedToken) {
      const userData = JSON.parse(storedUserData);
      loginUser(userData);
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchUserReservations(user.id);
    }
  }, [user, fetchUserReservations]);

  const fetchStayData = useCallback(async () => {
    const stayDataMap: Record<number, StayDataType> = {};
    const fetchPromises = reservations.map(async (reservation) => {
      if (!stayDataMap[reservation.stayListingId]) {
        try {
          const data = await fetchStayListingById(reservation.stayListingId.toString());
          stayDataMap[reservation.stayListingId] = data;
        } catch (error) {
          console.error(`Failed to fetch stay data for ID: ${reservation.stayListingId}`, error);
        }
      }
    });
    await Promise.all(fetchPromises);
    setStayData((prevData) => ({ ...prevData, ...stayDataMap }));
  }, [reservations]);

  useEffect(() => {
    if (reservations.length > 0) {
      fetchStayData();
    }
  }, [reservations, fetchStayData]);

  const handleCancelReservation = async (reservationId: number) => {
    setModal({
      isOpen: true,
      type: "confirm",
      message: "Are you sure you want to cancel this reservation?",
      onConfirm: async () => {
        try {
          await cancelUserReservation(reservationId);
          setModal({ ...modal, isOpen: false });
        } catch (error) {
          console.error("Failed to cancel reservation:", error);
          setModal({
            isOpen: true,
            type: "message",
            message: "Failed to cancel reservation. Please try again later.",
            onConfirm: () => setModal({ ...modal, isOpen: false }),
            onCancel: () => setModal({ ...modal, isOpen: false }),
          });
        }
      },
      onCancel: () => setModal({ ...modal, isOpen: false }),
    });
  };

  const handleDeleteAllCanceledReservations = async () => {
    if (user) {
      try {
        await deleteAllCanceledReservations(user.id);
      } catch (error) {
        console.error("Failed to delete all canceled reservations:", error);
      }
    }
  };

  const handleToggleShowAllReservations = () => {
    setShowAllReservations(!showAllReservations);
  };

  const displayedReservations = showAllReservations ? reservations : reservations.slice(0, 8);

  const renderSection = () => {
    return (
      <>
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-3xl font-semibold">My Reservations</h2>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

          {reservations.length > 0 ? (
            <div>
              <Tab.Group>
                <Tab.List className="flex space-x-1 overflow-x-auto items-center">
                  {categories.map((item) => (
                    <Tab key={item} as={React.Fragment}>
                      {({ selected }) => (
                        <button
                          className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${
                            selected
                              ? "bg-primary-6000 hover:bg-primary-700 text-neutral-50"
                              : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          }`}
                        >
                          {item}
                        </button>
                      )}
                    </Tab>
                  ))}
                  <div className="flex-grow"></div>
                  <ButtonSecondary onClick={handleDeleteAllCanceledReservations}>
                    Clear Canceled
                  </ButtonSecondary>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel className="mt-8">
                    <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {displayedReservations.map((reservation: ReservationDTO) => {
                        const stay = stayData[reservation.stayListingId];
                        return (
                          <div key={reservation.id}>
                            {stay ? (
                              <StayCard
                                data={stay}
                                badge={reservation.cancelled ? "CANCELED" : undefined}
                                onDelete={
                                  !reservation.cancelled
                                    ? () => handleCancelReservation(reservation.id!)
                                    : undefined
                                }
                              />
                            ) : (
                              <div>Loading...</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {reservations.length > 8 && (
                      <div className="flex mt-11 justify-center items-center">
                        <ButtonSecondary onClick={handleToggleShowAllReservations}>
                          {showAllReservations ? 'Hide Reservations' : 'View All Reservations'}
                        </ButtonSecondary>
                      </div>
                    )}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          ) : (
            <div className="mt-8 text-center text-neutral-500 dark:text-neutral-400">
              No reservations found.
            </div>
          )}
        </div>
        <Modal
          type={modal.type}
          message={modal.message}
          isOpen={modal.isOpen}
          onClose={modal.onCancel}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      </>
    );
  };

  return renderSection();
};

export default AccountReservations;
