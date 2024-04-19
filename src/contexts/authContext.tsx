import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/api/axiosConfig';
import { UserType, AuthContextType } from '@/data/authTypes'; 

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('user');
    if (storedUserData) {
      const userData: UserType = JSON.parse(storedUserData);
      setIsAuthenticated(true);
      setUser(userData);
    }
  }, []);

  const loginUser = async (userData: UserType & { token: string }) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logoutUser = () => {
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUserDetails = async (userData: UserType) => {
    try {
      const response = await axios.put(`/authors/${userData.id}`, userData, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      const updatedUser = {...userData, ...response.data, token: response.data.jwt || userData.token};
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, loginUser, logoutUser, updateUserDetails }}>
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
