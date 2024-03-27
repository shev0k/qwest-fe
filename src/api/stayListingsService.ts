// functions/fetchStayListings.ts
import { StayDataType } from "@/data/types"; // Ensure this path matches your project structure

const fetchStayListings = async (): Promise<StayDataType[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-listings`);
  if (!response.ok) {
    throw new Error('Failed to fetch stay listings');
  }
  const data: StayDataType[] = await response.json();
  return data;
};

export default fetchStayListings;
