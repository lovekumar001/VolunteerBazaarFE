import ScreenWrapper from '@/components/ScreenWrapper';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { wp, hp } from '../helper/common';
import { theme } from '../constants/theme';
import Button from '@/components/Button';
import {useRouter} from 'expo-router';

const Welcome = () => {
    const router = useRouter();
    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <View style={styles.container}>
                <Image 
                    style={styles.welcomeImage} 
                    resizeMode="contain" 
                    source={require('../assets/images/logo.png')} 
                />
                <View style={{ gap: 20 }}>
                    <Text style={styles.title}>VolunteerBazaar</Text>
                    <Text style={styles.punchline}>Aoo milkar kam krien</Text>
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Get Started"
                        buttonStyle={{ marginHorizontal: wp(3) }}
                        onPress={() => router.push('/signup')}
                    />

                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.loginText}>
                            Already Have an account!
                        </Text>
                        <Pressable onPress={()=>router.push('/login')}>
                            <Text style={[styles.loginText, { color: theme.colors.primaryDark || '#000', fontWeight: '600' }]}>
                                Login
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Welcome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingHorizontal: wp(4)
    },

    welcomeImage: {
        height: hp(30),
        width: wp(100),
        alignSelf: 'center'
    },

    title: {
        color: theme.colors.text || '#000',  // Ensure a valid color
        fontSize: hp(4),
        textAlign: 'center',
        fontWeight: 'bold'  // Replaced 'theme.fonts.extraBold' with 'bold'
    },

    punchline: {
        textAlign: 'center',
        paddingHorizontal: wp(20),
        fontSize: hp(1.7),
        color: theme.colors.text || '#000'
    },

    footer: {
        gap: 30,
        width: '100%'
    },

    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',  // Fixed typo 'cenetr' → 'center'
        alignItems: 'center',
        gap: 5
    },

    loginText: {
        textAlign: 'center',
        color: theme.colors.text || '#000',
        fontSize: hp(1.6)
    }
});
