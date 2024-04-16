import axios from 'axios';

interface SignUpData {
  email: string;
  password: string;
}

interface SignUpResponse {
  id: number;
  email: string;
}

export const signUp = async (data: SignUpData): Promise<SignUpResponse> => {
  try {
    const response = await axios.post<SignUpResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authors`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "An unexpected error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};
