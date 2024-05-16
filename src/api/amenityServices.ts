import axios, { AxiosError } from 'axios';


// Assuming you have a type definition for Amenity
export interface Amenity {
  id: number;
  name: string;
  category: string;
}

/**
 * Fetches all amenities.
 * @returns An array of Amenity objects.
 */
export const fetchAmenities = async (): Promise<Amenity[]> => {
  try {
    const response = await axios.get<Amenity[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/amenities`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("fetchAmenities error:", error.message);
      if (error.response) {
        console.error("Failed to fetch amenities, Status:", error.response.status);
      }
    } else {
      console.error("An unexpected error occurred while fetching amenities:", error);
    }
    throw new Error("Failed to fetch amenity data.");
  }
};

export default fetchAmenities;
