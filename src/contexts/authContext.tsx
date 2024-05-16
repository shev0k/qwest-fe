import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/api/axiosConfig';
import { UserType, AuthContextType } from '@/data/authTypes'; 

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');
    if (storedUserData && storedToken) {
      const userData: UserType = JSON.parse(storedUserData);
      setIsAuthenticated(true);
      setUser(userData);
    }
  }, []);

  const loginUser = async (userData: UserType & { token: string }) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', userData.token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logoutUser = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUserDetails = async (userData: UserType) => {
    try {
      const response = await axios.put(`/authors/${userData.id}`, userData);
      const updatedUser = { ...userData, ...response.data, token: response.data.jwt || userData.token };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      sessionStorage.setItem('token', updatedUser.token);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const updateUserAvatar = async (id: number, file: File, token: string) => {
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
      alert('Avatar updated successfully.');
    } catch (error) {
      console.error("Avatar update error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, loginUser, logoutUser, updateUserDetails, updateUserAvatar }}>
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
