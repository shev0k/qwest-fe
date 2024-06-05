import axiosInstance from '@/api/axiosConfig';
import { StayDataType } from '@/data/types';

export const fetchStayListingsByAuthor = async (authorId: number): Promise<StayDataType[]> => {
  try {
    const response = await axiosInstance.get<StayDataType[]>(`/authors/${authorId}/stay-listings`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch stay listings for author with ID: ${authorId}`, error);
    throw error;
  }
};
