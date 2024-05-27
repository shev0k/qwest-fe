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

const fetchStayListingsWithQuery = async (query: string): Promise<StayDataType[]> => {
  try {
    const response = await axios.get<StayDataType[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-listings${query}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to fetch stay listings with query:", error.message);
      if (error.response) {
        console.error('Failed with status:', error.response.status);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw new Error('Failed to fetch stay listings with query');
  }
};

const formatDate = (date: Date | null) => {
  if (!date) return "";
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split("T")[0]; // yyyy-MM-dd format
};

const buildQuery = (params: { location?: string; dates?: [Date | null, Date | null]; guests?: number; amenities?: number[]; typeOfStay?: string[]; priceRange?: number[]; rooms?: { bedrooms: number; beds: number; bathrooms: number }; propertyType?: string[]; page?: number; limit?: number }): string => {
  const query = new URLSearchParams();
  
  if (params.location) query.append("location", params.location);
  
  if (params.dates) {
    const formattedStartDate = formatDate(params.dates[0]);
    const formattedEndDate = params.dates[1] ? formatDate(params.dates[1]) : formattedStartDate;
    if (formattedStartDate) {
      query.append("dates", `${formattedStartDate} - ${formattedEndDate}`);
    }
  }
  
  if (params.guests) query.append("guests", params.guests.toString());
  
  if (params.amenities && params.amenities.length > 0) {
    query.append("amenities", params.amenities.join(','));
  }
  
  if (params.typeOfStay && params.typeOfStay.length > 0) {
    query.append("typeOfStay", params.typeOfStay.join(','));
  }

  if (params.priceRange && params.priceRange.length === 2) {
    query.append("priceMin", params.priceRange[0].toString());
    query.append("priceMax", params.priceRange[1].toString());
  }

  if (params.rooms) {
    const { bedrooms, beds, bathrooms } = params.rooms;
    if (bedrooms > 0) query.append("bedrooms", bedrooms.toString());
    if (beds > 0) query.append("beds", beds.toString());
    if (bathrooms > 0) query.append("bathrooms", bathrooms.toString());
  }

  if (params.propertyType && params.propertyType.length > 0) {
    query.append("propertyType", params.propertyType.join(','));
  }

  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());

  return `?${query.toString()}`;
};


export default fetchStayListings;
export { fetchStayListingsWithQuery, buildQuery, formatDate };
