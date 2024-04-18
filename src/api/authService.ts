import axios from 'axios';

interface SignUpData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Updated AuthResponse to include JWT token
interface AuthResponse {
  id: number;
  email: string;
  displayName?: string;
  avatar?: string;
  location?: string;
  jwt?: string;  // JWT token received from the server after successful authentication
}

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authors`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "An unexpected error occurred during sign up.");
    }
    throw new Error("An unexpected error occurred during sign up.");
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authors/login`, data);
    if (response.data.jwt) {
      console.log("Login successful, JWT: ", response.data.jwt); // Log the JWT for debugging purposes
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Login failed");
    }
    throw new Error("An unexpected error occurred during login");
  }
};
