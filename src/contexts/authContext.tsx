import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserType {
  displayName: string;
  avatar: string;
  location: string;
  email: string;
  token: string;  // Added token to user type
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserType | null;
  loginUser: (userData: UserType & { token: string }) => void; // Adjusted to include token
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        const userData: UserType = JSON.parse(storedUserData);
        setIsAuthenticated(true);
        setUser(userData);
        console.log('User logged in on init with user data:', userData);
      }
    }
  }, []);

  const loginUser = (userData: UserType & { token: string }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      console.log('User logged in with JWT:', userData.token);
    }
  };

  const logoutUser = () => {
    if (typeof window !== 'undefined') {
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
