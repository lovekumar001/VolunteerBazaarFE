import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ENDPOINTS, apiCall } from '@/helper/api';

// Define the shape of our user data
type User = {
  id?: number;
  name?: string;
  email: string;
  role?: string;
};

// Define the shape of our auth context
type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  isLoggedIn: false,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored token on app load
  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUserData = await AsyncStorage.getItem('userData');

        if (storedToken) {
          setToken(storedToken);
          if (storedUserData) {
            setUser(JSON.parse(storedUserData));
          }
        }
      } catch (error) {
        console.error('Error loading auth info from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredToken();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log(`Attempting to login with email: ${email}`);
      console.log(`Using API endpoint: ${ENDPOINTS.LOGIN}`);
      
      // Test endpoint availability
      try {
        const testResponse = await fetch(ENDPOINTS.LOGIN, { method: 'GET' });
        console.log(`API test connection: ${testResponse.status}`);
      } catch (testError) {
        console.error('API connection test failed:', testError);
      }
      
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log(`Response status: ${response.status}`);
      
      // For debugging purposes only - don't log this in production
      const responseText = await response.text();
      console.log(`Response body: ${responseText}`);
      
      // Parse JSON only if there's content and it's in correct format
      let data;
      try {
        data = responseText.length > 0 ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.log('Raw response:', responseText);
        data = {};
      }

      if (response.ok) {
        if (data.token) {
          // Store token
          await AsyncStorage.setItem('userToken', data.token);
          setToken(data.token);

          // Store user data
          if (data.user) {
            await AsyncStorage.setItem('userData', JSON.stringify(data.user));
            setUser(data.user);
          }
          
          console.log('Login successful');
          setIsLoading(false);
          return true;
        } else {
          console.log('No token in response:', data);
          Alert.alert('Error', 'Server returned success but no token was provided');
          setIsLoading(false);
          return false;
        }
      } else {
        console.log('Login failed:', data);
        Alert.alert('Error', data.message || 'Invalid email or password');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to connect to the server. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Clear storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      // Reset state
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Compute isLoggedIn value
  const isLoggedIn = !!token;

  // Context value
  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 