import axios from '@/api/axiosConfig';
import { SignUpData, LoginData, AuthResponse } from '@/data/authTypes';

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>('/authors', data);
    return response.data;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>('/authors/login', data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
