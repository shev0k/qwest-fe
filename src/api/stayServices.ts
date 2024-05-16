import axios from './axiosConfig';
import { StayDataType } from "@/data/types";

/**
 * Fetches all stay listings.
 * @returns An array of StayDataType objects.
 */
export const fetchStayListings = async (): Promise<StayDataType[]> => {
  try {
    const response = await axios.get<StayDataType[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-listings`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch stay listings:", error);
    throw error;
  }
};

/**
 * Fetches a single stay listing by ID.
 * @param id The ID of the stay listing to fetch.
 * @returns The StayDataType object.
 */
export const fetchStayListingById = async (id: string): Promise<StayDataType> => {
  try {
    const response = await axios.get<StayDataType>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-listings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch stay listing with ID: ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new stay listing.
 * @param stayData The data for the new stay listing.
 * @returns The created StayDataType object.
 */
export const createStayListing = async (stayData: StayDataType): Promise<StayDataType> => {
  try {
    const response = await axios.post<StayDataType>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-listings`, stayData);
    return response.data;
  } catch (error) {
    console.error("Create stay listing error:", error);
    throw error;
  }
};

/**
 * Updates an existing stay listing.
 * @param id The ID of the stay listing to update.
 * @param stayData The updated data for the stay listing.
 * @returns The updated StayDataType object.
 */
export const updateStayListing = async (id: string, stayData: StayDataType): Promise<StayDataType> => {
  try {
    const response = await axios.put<StayDataType>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-listings/${id}`, stayData);
    return response.data;
  } catch (error) {
    console.error(`Update stay listing error for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a stay listing.
 * @param id The ID of the stay listing to delete.
 */
export const deleteStayListing = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-listings/${id}`);
    console.log(`Deleted stay listing with ID: ${id}`);
  } catch (error) {
    console.error(`Delete stay listing error for ID ${id}:`, error);
    throw error;
  }
};
