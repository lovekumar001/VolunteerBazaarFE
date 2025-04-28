// API configuration file

// Replace this with your development machine's IP address when testing on a physical device
// Use localhost when testing in an emulator that runs on the same machine
export const API_BASE_URL = 'http://10.11.66.176:3000';

// API endpoints
export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  EVENTS: `${API_BASE_URL}/events`,
  EVENT_DETAILS: (id: number | string) => `${API_BASE_URL}/events/${id}`,
  EVENT_REGISTER: (eventId: number | string, userId: number | string) => 
    `${API_BASE_URL}/events/${eventId}/register/${userId}`,
  USER_EVENTS: (userId: number | string) => `${API_BASE_URL}/events/user/${userId}`,
  // Add more endpoints as needed
};

// Helper function for API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(endpoint, options);
    const data = await response.json();
    return { data, status: response.status, ok: response.ok };
  } catch (error) {
    console.error(`API call error: ${endpoint}`, error);
    throw error;
  }
}; 