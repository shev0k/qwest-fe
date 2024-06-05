import axiosInstance from './axiosConfig';
import { ReservationDTO } from '@/data/types';

export async function createReservation(reservation: ReservationDTO): Promise<ReservationDTO> {
  try {
    const response = await axiosInstance.post<ReservationDTO>('/reservations', reservation);
    return response.data;
  } catch (error) {
    console.error("Failed to create reservation:", error);
    throw error;
  }
}

export async function fetchReservationsByAuthor(authorId: number): Promise<ReservationDTO[]> {
  try {
    const response = await axiosInstance.get<ReservationDTO[]>(`/reservations/author/${authorId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch reservations for author:", error);
    throw error;
  }
}

export async function fetchReservationsByStay(stayListingId: number): Promise<ReservationDTO[]> {
  try {
    const response = await axiosInstance.get<ReservationDTO[]>(`/reservations/stay/${stayListingId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch reservations for stay:", error);
    throw error;
  }
}

export async function cancelReservation(reservationId: number): Promise<void> {
  try {
    await axiosInstance.put(`/reservations/${reservationId}/cancel`);
  } catch (error) {
    console.error("Failed to cancel reservation:", error);
    throw error;
  }
}

export async function deleteCanceledReservationsByAuthor(authorId: number): Promise<void> {
  try {
    await axiosInstance.delete(`/reservations/author/${authorId}/canceled`);
  } catch (error) {
    console.error("Failed to delete canceled reservations:", error);
    throw error;
  }
}
