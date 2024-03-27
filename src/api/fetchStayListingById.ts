import { StayDataType } from "@/data/types";

const fetchStayListingById = async (id: string): Promise<StayDataType> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-listings/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stay listing with ID: ${id}, Status: ${response.status}`);
    }
    const data: StayDataType = await response.json();
    return data;
  } catch (error) {
    console.error("fetchStayListingById error:", error);
    throw new Error("Failed to fetch stay listing data.");
  }
};

export default fetchStayListingById;
