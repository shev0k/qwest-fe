import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ReservationDTO } from '@/data/types';
import { fetchReservationsByAuthor, createReservation, cancelReservation, deleteCanceledReservationsByAuthor } from '@/api/reservation';
import { useAuth } from './authContext';

interface ReservationContextType {
  reservations: ReservationDTO[];
  fetchUserReservations: (authorId: number) => Promise<void>;
  addReservation: (reservation: ReservationDTO) => Promise<ReservationDTO>;
  cancelUserReservation: (reservationId: number) => Promise<void>;
  deleteAllCanceledReservations: (authorId: number) => Promise<void>;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserReservations(user.id);
    }
  }, [user]);

  const fetchUserReservations = useCallback(async (authorId: number) => {
    try {
      const fetchedReservations = await fetchReservationsByAuthor(authorId);
      setReservations(fetchedReservations);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  }, []);

  const addReservation = useCallback(async (reservation: ReservationDTO) => {
    try {
      const newReservation = await createReservation(reservation);
      setReservations(prevReservations => [...prevReservations, newReservation]);
      return newReservation;
    } catch (error) {
      console.error("Failed to create reservation:", error);
      throw error;
    }
  }, []);

  const cancelUserReservation = useCallback(async (reservationId: number) => {
    try {
      await cancelReservation(reservationId);
      setReservations(prevReservations =>
        prevReservations.map(reservation =>
          reservation.id === reservationId ? { ...reservation, cancelled: true } : reservation
        )
      );
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      throw error;
    }
  }, []);

  const deleteAllCanceledReservations = useCallback(async (authorId: number) => {
    try {
      await deleteCanceledReservationsByAuthor(authorId);
      setReservations(prevReservations =>
        prevReservations.filter(reservation => !reservation.cancelled)
      );
    } catch (error) {
      console.error("Failed to delete canceled reservations:", error);
      throw error;
    }
  }, []);

  return (
    <ReservationContext.Provider value={{ reservations, fetchUserReservations, addReservation, cancelUserReservation, deleteAllCanceledReservations }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};

export default ReservationContext;
