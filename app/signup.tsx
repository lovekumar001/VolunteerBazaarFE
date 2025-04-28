import { StyleSheet, Pressable, Text, View, StatusBar, Alert, ScrollView, TextStyle, ViewStyle } from 'react-native';
import React, { useState, useRef } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import Icon from '../assets/icons';
import BackButton from '@/components/BackButton';
import { useRouter } from 'expo-router';
import { wp, hp } from '@/helper/common';
import { theme } from '../constants/theme';
import Input from '@/components/input';
import Button from '@/components/Button';
import { ENDPOINTS } from '@/helper/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleType, createStyles, conditionalStyle } from '@/helper/styles';

type RoleType = 'volunteer' | 'organization';

// Define styles interface
interface StylesType {
    container: ViewStyle;
    welcomeText: TextStyle;
    toggleContainer: ViewStyle;
    toggleButton: ViewStyle;
    activeButton: ViewStyle;
    toggleText: TextStyle;
    activeText: TextStyle;
    form: ViewStyle;
    footer: ViewStyle;
    footerText: TextStyle;
}

const SignUp = () => {
    const router = useRouter();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<RoleType>('volunteer'); 
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [bio, setBio] = useState('');

    const handleSignUp = async () => {
        setLoading(true);
        console.log(`Attempting to sign up as ${role}`);
        console.log(`API Endpoint: ${ENDPOINTS.SIGNUP}`);
        
        try {
            // Create payload based on role
            const payload: Record<string, any> = {
                name,
                email,
                password,
                role: role.toLowerCase(),
            };
            
            // Add volunteer-specific fields if role is volunteer
            if (role.toLowerCase() === 'volunteer') {
                Object.assign(payload, {
                    gender: gender || 'prefer not to say',
                    age: age ? parseInt(age) : 0,
                    bio: bio || ''
                });
            }
            
            console.log('Signup payload:', JSON.stringify(payload, null, 2));
            
            const response = await fetch(ENDPOINTS.SIGNUP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            console.log(`Response status: ${response.status}`);
            
            const responseText = await response.text();
            console.log(`Response text: ${responseText}`);
            
            let data;
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error('Error parsing response:', e);
                data = {};
            }
            
            if (response.ok) {
                // Store token if provided
                if (data.token) {
                    await AsyncStorage.setItem('userToken', data.token);
                    
                    // Store user data if available
                    if (data.user) {
                        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
                    }
                }
                
                Alert.alert(
                    'Success', 
                    `${role === 'volunteer' ? 'Volunteer' : 'Organization'} account created successfully!`,
                    [{ text: 'OK', onPress: () => router.push('/login') }]
                );
            } else {
                Alert.alert('Error', data.message || 'Failed to create account. Please try again.');
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill all the required fields');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }
        
        handleSignUp();
    };

    // Helper function to get toggle button style
    const getToggleButtonStyle = (isActive: boolean) => {
        return isActive 
            ? [styles.toggleButton, styles.activeButton] as ViewStyle[]
            : styles.toggleButton;
    };

    // Helper function to get toggle text style
    const getToggleTextStyle = (isActive: boolean) => {
        return isActive 
            ? [styles.toggleText, styles.activeText] as TextStyle[]
            : styles.toggleText;
    };

    // Create footer text style with type assertion
    const loginTextStyle = [
        styles.footerText, 
        { 
            color: theme.colors.primaryDark, 
            fontWeight: theme.fonts.semibold 
        } as TextStyle
    ] as TextStyle[];

    return (
        <ScreenWrapper bg="white">
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <ScrollView>
                <View style={styles.container}>
                    <BackButton router={router} />

                    <View>
                        <Text style={styles.welcomeText}>Let's,</Text>
                        <Text style={styles.welcomeText}>Get Started</Text>
                    </View>

                    <View style={styles.toggleContainer}>
                        <Pressable
                            style={getToggleButtonStyle(role === 'volunteer')}
                            onPress={() => setRole('volunteer')}
                        >
                            <Text style={getToggleTextStyle(role === 'volunteer')}>
                                Volunteer
                            </Text>
                        </Pressable>
                        <Pressable
                            style={getToggleButtonStyle(role === 'organization')}
                            onPress={() => setRole('organization')}
                        >
                            <Text style={getToggleTextStyle(role === 'organization')}>
                                Organization
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.form}>
                        <Input
                            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                            placeholder={role === 'volunteer' ? "Enter your name" : "Enter Organization Name"}
                            value={name}
                            onChangeText={(value: string) => setName(value)}  
                        />
                        <Input
                            ref={emailRef}
                            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(value: string) => setEmail(value)}  
                        />
                        <Input
                            ref={passwordRef}
                            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                            placeholder="Enter your password"
                            secureTextEntry
                            value={password}
                            onChangeText={(value: string) => setPassword(value)}  
                        />
                        
                        {/* Show additional fields for volunteers */}
                        {role === 'volunteer' && (
                            <>
                                <Input
                                    icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                                    placeholder="Enter your gender (optional)"
                                    value={gender}
                                    onChangeText={(value: string) => setGender(value)}  
                                />
                                <Input
                                    icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                                    placeholder="Enter your age (optional)"
                                    keyboardType="numeric"
                                    value={age}
                                    onChangeText={(value: string) => setAge(value)}  
                                />
                                <Input
                                    icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                                    placeholder="Enter your bio (optional)"
                                    multiline
                                    numberOfLines={3}
                                    value={bio}
                                    onChangeText={(value: string) => setBio(value)}  
                                />
                            </>
                        )}

                        <Button 
                            title={'Sign Up'} 
                            loading={loading} 
                            onPress={onSubmit}
                            buttonStyle={{ backgroundColor: theme.colors.primary }}
                            textStyle={{ color: 'white' }}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Already have an account?{' '}
                                <Pressable onPress={() => router.push('/login')}>
                                    <Text style={loginTextStyle}>
                                        Login
                                    </Text>
                                </Pressable>
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default SignUp;

// Use the createStyles function to type-safe styles
const styles = StyleSheet.create<StylesType>({
    container: {
        flex: 1,
        gap: 20,
        paddingHorizontal: wp(5),
        paddingBottom: hp(5),
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold as TextStyle['fontWeight'],
        color: theme.colors.text,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15
    },
    toggleButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    activeButton: {
        backgroundColor: theme.colors.primary,
    },
    toggleText: {
        fontSize: hp(2),
        color: theme.colors.primary,
    },
    activeText: {
        color: 'white',
        fontWeight: theme.fonts.semibold as TextStyle['fontWeight'],
    },
    form: {
        gap: 20,
        marginTop: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        marginTop: 15,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6),
    },
});
