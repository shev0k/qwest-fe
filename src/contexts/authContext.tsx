import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '@/api/axiosConfig';
import { UserType, AuthContextType } from '@/data/authTypes';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '@/api/wishlist';
import { StayDataType } from '@/data/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [wishlist, setWishlist] = useState<StayDataType[]>([]);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');
    if (storedUserData && storedToken) {
      const userData: UserType = JSON.parse(storedUserData);
      userData.wishlistIds = userData.wishlistIds || [];
      setIsAuthenticated(true);
      setUser(userData);
      fetchUserWishlist(userData.id);
    }
  }, []);

  const fetchUserWishlist = useCallback(async (userId: number) => {
    try {
      const wishlistData = await fetchWishlist(userId);
      setWishlist(wishlistData);
    } catch (error) {
      console.error("Failed to fetch user wishlist:", error);
    }
  }, []);

  const loginUser = async (userData: UserType & { token: string }) => {
    userData.wishlistIds = userData.wishlistIds || [];
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', userData.token);
    setIsAuthenticated(true);
    setUser(userData);
    fetchUserWishlist(userData.id);
  };

  const logoutUser = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setWishlist([]);
  };

  const updateUserDetails = async (userData: UserType) => {
    try {
      const response = await axios.put(`/authors/${userData.id}`, userData);
      const updatedUser = { ...userData, ...response.data, token: response.data.jwt || userData.token };
      updatedUser.wishlistIds = updatedUser.wishlistIds || [];
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      sessionStorage.setItem('token', updatedUser.token);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const updateUserAvatar = async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.put(`/authors/${id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (!user) {
        console.error("User data is not loaded");
        return;
      }
     
      const updatedUser: UserType = {
        ...user,
        avatar: response.data.avatar
      };
     
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Avatar update error:", error);
      throw error;
    }
  };

  const handleAddToWishlist = async (stayId: number) => {
    if (user) {
      await addToWishlist(user.id, stayId);
      const updatedWishlist = [...user.wishlistIds, stayId];
      const updatedUser = { ...user, wishlistIds: updatedWishlist };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      fetchUserWishlist(user.id);
    } else {
      throw new Error('User is not authenticated');
    }
  };

  const handleRemoveFromWishlist = async (stayId: number) => {
    if (user) {
      await removeFromWishlist(user.id, stayId);
      const updatedWishlist = user.wishlistIds.filter(id => id !== stayId);
      const updatedUser = { ...user, wishlistIds: updatedWishlist };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      fetchUserWishlist(user.id);
    } else {
      throw new Error('User is not authenticated');
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      wishlist,
      setUser,
      loginUser,
      logoutUser,
      updateUserDetails,
      updateUserAvatar,
      handleAddToWishlist,
      handleRemoveFromWishlist,
      fetchUserWishlist
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
