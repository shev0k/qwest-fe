import axiosInstance from './axiosConfig';
import { StayDataType } from "@/data/types";

export const addToWishlist = async (authorId: number, stayId: number): Promise<void> => {
  try {
    await axiosInstance.post(`/authors/${authorId}/wishlist/${stayId}`);
  } catch (error) {
    console.error("Add to wishlist error:", error);
    throw error;
  }
};

export const removeFromWishlist = async (authorId: number, stayId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/authors/${authorId}/wishlist/${stayId}`);
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    throw error;
  }
};

export const fetchWishlist = async (authorId: number): Promise<StayDataType[]> => {
    try {
      const response = await axiosInstance.get<StayDataType[]>(`/authors/${authorId}/wishlist`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      throw error;
    }
  };
