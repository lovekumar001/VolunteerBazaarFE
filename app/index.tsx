import React, { useEffect } from 'react';
import { Text, View, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/constants/theme';

const Index = () => {
    const router = useRouter();
    const { isLoggedIn, isLoading, user } = useAuth();

    useEffect(() => {
        // If loading is complete and we have auth state
        if (!isLoading) {
            if (isLoggedIn) {
                // User is logged in, redirect to appropriate screen
                if (user?.role === 'organization') {
                    router.replace('/home2');
                } else {
                    router.replace('/home');
                }
            } else {
                // User is not logged in, redirect to welcome screen
                router.replace('/welcome');
            }
        }
    }, [isLoading, isLoggedIn, user, router]);

    // Show loading screen while checking auth state
    if (isLoading) {
        return (
            <ScreenWrapper>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={{ marginTop: 10 }}>Loading...</Text>
                    <View style={{ marginTop: 20 }}>
                        <Button
                            title="Test API Connection"
                            onPress={() => router.push('/testapi')}
                        />
                    </View>
                </View>
            </ScreenWrapper>
        );
    }

    // This won't typically be shown as we redirect in the useEffect
    return (
        <ScreenWrapper>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Redirecting...</Text>
                <View style={{ marginTop: 20 }}>
                    <Button
                        title="Test API Connection"
                        onPress={() => router.push('/testapi')}
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Index;