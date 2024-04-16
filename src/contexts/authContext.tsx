import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserType {
  displayName: string;
  avatar: string;
  location: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserType | null;
  loginUser: (userData: UserType) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuthState = localStorage.getItem('isAuthenticated');
      const storedUserData = localStorage.getItem('user');
      try {
        const userData = storedUserData ? JSON.parse(storedUserData) : null;
        if (storedAuthState === 'true' && userData) {
          setIsAuthenticated(true);
          setUser(userData);
          console.log('User logged in on init with user data:', userData);
        }
      } catch (error) {
        console.error('Error parsing user data on init:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, []);

  const loginUser = (userData: UserType) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      console.log('User logged in:', userData);
    }
  };

  const logoutUser = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      console.log('User logged out');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
