import { StyleSheet, Pressable, Text, View, StatusBar, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import Icon from '../assets/icons';
import BackButton from '@/components/BackButton';
import { useRouter } from 'expo-router';
import { wp, hp } from '@/helper/common';
import { theme } from '../constants/theme';
import Input from '@/components/input';
import Button from '@/components/Button';

const SignUp = () => {
    const router = useRouter();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Volunteer'); 

    const handleSignUp = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const onSubmit = () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill all the fields');
            return;
        }
        handleSignUp();
    };

    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <View style={styles.container}>
                <BackButton router={router} />

                <View>
                    <Text style={styles.welcomeText}>Let's,</Text>
                    <Text style={styles.welcomeText}>Get Started</Text>
                </View>

                <View style={styles.toggleContainer}>
                    <Pressable
                        style={[styles.toggleButton, role === 'Volunteer' && styles.activeButton]}
                        onPress={() => setRole('Volunteer')}
                    >
                        <Text style={[styles.toggleText, role === 'Volunteer' && styles.activeText]}>Volunteer</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.toggleButton, role === 'Organization' && styles.activeButton]}
                        onPress={() => setRole('Organization')}
                    >
                        <Text style={[styles.toggleText, role === 'Organization' && styles.activeText]}>Organization</Text>
                    </Pressable>
                </View>

                <View style={styles.form}>
                    <Input
                        icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                        placeholder={role === 'Volunteer' ? "Enter your name" : "Enter Organization Name"}
                        onChangeText={value => setName(value)}  
                    />
                    <Input
                        ref={emailRef}
                        icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                        placeholder="Enter your email"
                        onChangeText={value => setEmail(value)}  
                    />
                    <Input
                        ref={passwordRef}
                        icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                        placeholder="Enter your password"
                        secureTextEntry
                        onChangeText={value => setPassword(value)}  
                    />

                    <Button title={'Sign Up'} loading={loading} onPress={onSubmit} />

                    <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account? 
                        <Pressable>
                            <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold }]}>Login</Text>
                        </Pressable>
                    </Text>
                </View>
                </View>

                
            </View>
        </ScreenWrapper>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
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
        fontWeight: theme.fonts.semibold,
    },
    form: {
        gap: 25,
        marginTop: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6),
    },
});
