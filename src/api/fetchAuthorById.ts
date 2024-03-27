// src/api/fetchAuthorById.ts
import { AuthorType } from "@/data/types"; // Define this type based on your author data structure

const fetchAuthorById = async (authorId: number): Promise<AuthorType> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authors/${authorId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch author with ID: ${authorId}, Status: ${response.status}`);
    }
    const data: AuthorType = await response.json();
    return data;
  } catch (error) {
    console.error("fetchAuthorById error:", error);
    throw new Error("Failed to fetch author data.");
  }
};

export default fetchAuthorById;
