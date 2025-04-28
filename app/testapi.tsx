import { View, Text, Button, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { API_BASE_URL, ENDPOINTS } from '@/helper/api';
import { useRouter } from 'expo-router';

// Define the style types for type safety
interface Styles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  buttonContainer: ViewStyle;
  resultsContainer: ViewStyle;
  resultsText: TextStyle;
}

const TestAPI = () => {
  const router = useRouter();
  const [results, setResults] = useState('No tests run yet');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setResults('Testing connection...\n');
    
    try {
      // Test base URL
      setResults(prev => prev + `\nTesting connection to ${API_BASE_URL}...`);
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
      });
      
      setResults(prev => prev + `\nBase URL response: ${response.status}`);
      
      // Test login endpoint
      setResults(prev => prev + `\n\nTesting login endpoint (${ENDPOINTS.LOGIN})...`);
      try {
        const loginResponse = await fetch(ENDPOINTS.LOGIN, {
          method: 'GET',
        });
        setResults(prev => prev + `\nLogin endpoint response: ${loginResponse.status}`);
      } catch (error: any) {
        setResults(prev => prev + `\nLogin endpoint error: ${error.message}`);
      }
      
      // Test signup endpoint
      setResults(prev => prev + `\n\nTesting signup endpoint (${ENDPOINTS.SIGNUP})...`);
      try {
        const signupResponse = await fetch(ENDPOINTS.SIGNUP, {
          method: 'GET',
        });
        setResults(prev => prev + `\nSignup endpoint response: ${signupResponse.status}`);
      } catch (error: any) {
        setResults(prev => prev + `\nSignup endpoint error: ${error.message}`);
      }
      
      // Test events endpoint
      setResults(prev => prev + `\n\nTesting events endpoint (${ENDPOINTS.EVENTS})...`);
      try {
        const eventsResponse = await fetch(ENDPOINTS.EVENTS, {
          method: 'GET',
        });
        setResults(prev => prev + `\nEvents endpoint response: ${eventsResponse.status}`);
        
        if (eventsResponse.ok) {
          const data = await eventsResponse.json();
          setResults(prev => prev + `\nReceived ${data.length || 'no'} events`);
        }
      } catch (error: any) {
        setResults(prev => prev + `\nEvents endpoint error: ${error.message}`);
      }
      
      setResults(prev => prev + '\n\nTests completed.');
    } catch (error: any) {
      setResults(prev => prev + `\nGeneral error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const testLogin = async () => {
    setIsLoading(true);
    setResults('Testing login with volunteer@example.com / password123...\n');
    
    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'volunteer@example.com',
          password: 'password123',
        }),
      });
      
      setResults(prev => prev + `\nStatus code: ${response.status}`);
      
      const responseText = await response.text();
      setResults(prev => prev + `\n\nResponse body:\n${responseText}`);
      
      try {
        if (responseText.length > 0) {
          const data = JSON.parse(responseText);
          setResults(prev => prev + `\n\nParsed response: ${JSON.stringify(data, null, 2)}`);
        }
      } catch (error: any) {
        setResults(prev => prev + `\n\nFailed to parse JSON: ${error.message}`);
      }
    } catch (error: any) {
      setResults(prev => prev + `\nError: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSignup = async () => {
    setIsLoading(true);
    setResults('Testing volunteer signup...\n');
    
    const testEmail = `volunteer${Math.floor(Math.random() * 10000)}@example.com`;
    
    try {
      const volunteerData = {
        name: "Test Volunteer",
        email: testEmail,
        password: "password123",
        role: "volunteer",
        gender: "male",
        age: 28,
        bio: "Test volunteer account for API testing"
      };
      
      setResults(prev => prev + `Using email: ${testEmail}\n`);
      setResults(prev => prev + `\nSending volunteer data to ${ENDPOINTS.SIGNUP}:\n${JSON.stringify(volunteerData, null, 2)}\n`);
      
      const response = await fetch(ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(volunteerData),
      });
      
      setResults(prev => prev + `\nStatus code: ${response.status}`);
      
      const responseText = await response.text();
      setResults(prev => prev + `\n\nResponse body:\n${responseText}`);
      
      try {
        if (responseText.length > 0) {
          const data = JSON.parse(responseText);
          setResults(prev => prev + `\n\nParsed response: ${JSON.stringify(data, null, 2)}`);
        }
      } catch (error: any) {
        setResults(prev => prev + `\n\nFailed to parse JSON: ${error.message}`);
      }
    } catch (error: any) {
      setResults(prev => prev + `\nError: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>API Connection Test</Text>
        <Text style={styles.subtitle}>URL: {API_BASE_URL}</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Test Connection"
            onPress={testConnection}
            disabled={isLoading}
          />
          <Button
            title="Test Login"
            onPress={testLogin}
            disabled={isLoading}
          />
          <Button
            title="Test Signup"
            onPress={testSignup}
            disabled={isLoading}
          />
        </View>
        
        <Button
          title="Back to Login"
          onPress={() => router.push('/login')}
          disabled={isLoading}
        />
        
        <ScrollView style={styles.resultsContainer}>
          <Text style={styles.resultsText}>{results}</Text>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  resultsContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginTop: 10,
  },
  resultsText: {
    fontFamily: 'monospace',
  },
});

export default TestAPI; 