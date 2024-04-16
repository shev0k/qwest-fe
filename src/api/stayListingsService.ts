import axios from 'axios';
import { StayDataType } from "@/data/types";

const fetchStayListings = async (): Promise<StayDataType[]> => {
  try {
    const response = await axios.get<StayDataType[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-listings`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to fetch stay listings:", error.message);
      if (error.response) {
        console.error('Failed with status:', error.response.status);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw new Error('Failed to fetch stay listings');
  }
};

export default fetchStayListings;
