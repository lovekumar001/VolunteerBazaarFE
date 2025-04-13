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

const Login = () => {
    const router = useRouter();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (email === 'love' && password === 'love') {
                Alert.alert('Success', 'Login successful!');
                router.push('/home'); // Navigate to the home page
            }
            else if(email==='kumar' && password==='kumar'){
                Alert.alert('Success', 'Login successful!');
                router.push('/home2');
            } 
            else {
                Alert.alert('Error', 'Invalid email or password');
            }
        }, 2000);
    };

    const onSubmit = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill all the fields');
            return;
        }
        handleLogin();
    };

    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <View style={styles.container}>
                <BackButton router={router} />

                <View>
                    <Text style={styles.welcomeText}>Heyy,</Text>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                </View>

                <View style={styles.form}>
                    <Text style={{ fontSize: hp(2.2), color: theme.colors.text }}>
                        Please login to continue...
                    </Text>
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

                    <Text style={styles.forgotPassword}>Forget Password?</Text>
                    <Button title={'Login'} loading={loading} onPress={onSubmit} />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Don't have an account? 
                        <Pressable>
                            <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold }]}>SignUp</Text>
                        </Pressable>
                    </Text>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Login;

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
    form: {
        gap: 25,
        marginTop: 20,
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
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
        fontSize: hp(2.2),
    },
});
