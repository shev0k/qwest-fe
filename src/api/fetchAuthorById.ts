import axios from 'axios';
import axiosInstance from '@/api/axiosConfig';
import { AuthorType } from "@/data/types";

const fetchAuthorById = async (authorId: number): Promise<AuthorType> => {
  try {
    const response = await axiosInstance.get<AuthorType>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authors/${authorId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("fetchAuthorById error:", error.message);
      if (error.response) {
        console.error(`Failed to fetch author with ID: ${authorId}, Status: ${error.response.status}`);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw new Error("Failed to fetch author data.");
  }
};

export default fetchAuthorById;
