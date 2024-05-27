import { StayDataType } from "@/data/types";

export interface UserType {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  country?: string;
  phoneNumber?: string;
  description?: string;
  count?: number;
  starRating?: number;
  role?: string;
  token: string;
  wishlistIds: number[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserType | null;
  wishlist: StayDataType[];
  setUser: (user: UserType) => void;
  loginUser: (userData: UserType & { token: string }) => void;
  logoutUser: () => void;
  updateUserDetails: (userData: UserType) => Promise<void>;
  updateUserAvatar: (id: number, file: File) => Promise<void>;
  handleAddToWishlist: (stayId: number) => Promise<void>;
  handleRemoveFromWishlist: (stayId: number) => Promise<void>;
  fetchUserWishlist: (userId: number) => Promise<void>;

}

export interface SignUpData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  country?: string;
  phoneNumber?: string;
  description?: string;
  count?: number;
  starRating?: number;
  role?: string;
  jwt: string;
  wishlistIds: number[];
}
