import axios, { AxiosError } from 'axios';
import { StayDataType } from "@/data/types";

const fetchStayListingById = async (id: string): Promise<StayDataType> => {
  try {
    const response = await axios.get<StayDataType>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-listings/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("fetchStayListingById error:", error.message);
      if (error.response) {
        console.error(`Failed to fetch stay listing with ID: ${id}, Status: ${error.response.status}`);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw new Error("Failed to fetch stay listing data.");
  }
};

export default fetchStayListingById;
