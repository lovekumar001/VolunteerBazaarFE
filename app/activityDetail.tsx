import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Header from '@/components/Header';
import { wp, hp } from '@/helper/common';
import { theme } from '@/constants/theme';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from 'react';
import { ENDPOINTS, apiCall } from '@/helper/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EventDetails {
    event_id: number;
    title: string;
    event_type_id: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    city_id: number;
    organization_id: number;
    rating: number | null;
    description?: string;
}

const ActivityDetail = () => {
    const params = useLocalSearchParams();
    const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Get user data from AsyncStorage
    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    setUserId(parsedData.user_id || parsedData.id);
                }
            } catch (error) {
                console.error('Error getting user data:', error);
            }
        };
        getUserData();
    }, []);

    // Fetch event details
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(ENDPOINTS.EVENT_DETAILS(id));
                if (!response.ok) {
                    throw new Error('Failed to fetch event details');
                }
                const data = await response.json();
                setEvent(data);
            } catch (error) {
                console.error('Error fetching event details:', error);
                Alert.alert('Error', 'Failed to load event details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventDetails();
        }
    }, [id]);

    const handleRegister = async () => {
        if (!userId) {
            Alert.alert('Login Required', 'Please login to register for this event', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => router.push('/login') }
            ]);
            return;
        }

        try {
            setRegistering(true);
            const response = await fetch(ENDPOINTS.EVENT_REGISTER(id, userId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            Alert.alert('Success', 'You have successfully registered for this event!', [
                { text: 'OK', onPress: () => router.push('/home') }
            ]);
        } catch (error: any) {
            console.error('Error registering for event:', error);
            Alert.alert('Error', `Failed to register: ${error.message}`);
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.screen, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading event details...</Text>
            </View>
        );
    }

    if (!event) {
        return (
            <View style={[styles.screen, styles.errorContainer]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={64} color={theme.colors.rose} />
                <Text style={styles.errorText}>Event not found</Text>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    // Format dates and times
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const time = new Date();
        time.setHours(parseInt(hours, 10));
        time.setMinutes(parseInt(minutes, 10));
        return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    return (
        <View style={styles.screen}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header title="Event Details" mb={20} />
                
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{event.title}</Text>
                        <View style={styles.organizationBadge}>
                            <Text style={styles.organizationText}>Organization #{event.organization_id}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.dateTimeCard}>
                        <View style={styles.dateRow}>
                            <MaterialCommunityIcons name="calendar" size={24} color={theme.colors.primary} />
                            <View>
                                <Text style={styles.dateLabel}>Date</Text>
                                <Text style={styles.dateValue}>{formatDate(event.start_date)}</Text>
                                {event.start_date !== event.end_date && (
                                    <Text style={styles.dateValue}>to {formatDate(event.end_date)}</Text>
                                )}
                            </View>
                        </View>
                        <View style={styles.dateRow}>
                            <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
                            <View>
                                <Text style={styles.dateLabel}>Time</Text>
                                <Text style={styles.dateValue}>{formatTime(event.start_time)} - {formatTime(event.end_time)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>About This Event</Text>
                        <Text style={styles.text}>{event.description || "Join us in making a difference by participating in this volunteering activity. Your support can create a significant impact!"}</Text>
                    </View>

                    {event.rating !== null && (
                        <View style={styles.ratingCard}>
                            <Text style={styles.sectionTitle}>Event Rating</Text>
                            <View style={styles.ratingContainer}>
                                {[...Array(5)].map((_, index) => (
                                    <MaterialCommunityIcons 
                                        key={index} 
                                        name={index < (event.rating ? Math.round(event.rating) : 0) ? "star" : "star-outline"} 
                                        size={24} 
                                        color="#FFD700" 
                                    />
                                ))}
                                <Text style={styles.ratingText}>{event.rating ? event.rating.toFixed(1) : "0.0"}</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.locationCard}>
                        <Text style={styles.sectionTitle}>Location</Text>
                        <View style={styles.locationRow}>
                            <MaterialCommunityIcons name="map-marker" size={24} color={theme.colors.primary} />
                            <Text style={styles.locationText}>City ID: {event.city_id}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            
            <View style={styles.fixedBottom}>
                <Pressable 
                    style={[styles.registerButton, registering && styles.registeringButton]} 
                    onPress={handleRegister}
                    disabled={registering}
                >
                    {registering ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text style={styles.registerText}>Register Now</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
};

export default ActivityDetail;

const styles = StyleSheet.create({
    screen: { 
        flex: 1, 
        backgroundColor: '#F7F9FC', 
    },
    container: { 
        flex: 1, 
        paddingHorizontal: wp(5),
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: hp(2),
        color: theme.colors.text,
        marginTop: hp(2),
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp(5),
    },
    errorText: {
        fontSize: hp(2.5),
        color: theme.colors.text,
        marginTop: hp(2),
        marginBottom: hp(3),
    },
    backButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: wp(8),
        paddingVertical: hp(1.5),
        borderRadius: theme.radius.md,
    },
    backButtonText: {
        color: 'white',
        fontSize: hp(2),
        fontWeight: '600',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: hp(3),
    },
    title: {
        fontSize: hp(3.5),
        fontWeight: 'bold',
        color: theme.colors.textDark,
        textAlign: 'center',
        marginBottom: hp(1),
    },
    organizationBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.7),
        borderRadius: theme.radius.xl,
    },
    organizationText: {
        color: 'white',
        fontSize: hp(1.6),
        fontWeight: '600',
    },
    dateTimeCard: {
        backgroundColor: 'white',
        borderRadius: theme.radius.lg,
        padding: wp(4),
        marginBottom: hp(3),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1.5),
    },
    dateLabel: {
        fontSize: hp(1.6),
        color: theme.colors.textLight,
        marginLeft: wp(3),
    },
    dateValue: {
        fontSize: hp(1.8),
        fontWeight: '600',
        color: theme.colors.text,
        marginLeft: wp(3),
    },
    card: {
        backgroundColor: 'white',
        borderRadius: theme.radius.lg,
        padding: wp(4),
        marginBottom: hp(3),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: hp(2.2),
        fontWeight: 'bold',
        color: theme.colors.textDark,
        marginBottom: hp(1.5),
    },
    text: {
        fontSize: hp(1.9),
        lineHeight: hp(2.8),
        color: theme.colors.text,
    },
    ratingCard: {
        backgroundColor: 'white',
        borderRadius: theme.radius.lg,
        padding: wp(4),
        marginBottom: hp(3),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: wp(2),
        fontSize: hp(1.8),
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    locationCard: {
        backgroundColor: 'white',
        borderRadius: theme.radius.lg,
        padding: wp(4),
        marginBottom: hp(6),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: hp(1.8),
        color: theme.colors.text,
        marginLeft: wp(3),
    },
    fixedBottom: {
        backgroundColor: 'white',
        paddingVertical: hp(2),
        paddingHorizontal: wp(5),
        borderTopWidth: 1,
        borderTopColor: '#EAECEF',
    },
    registerButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: hp(2),
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    registeringButton: {
        opacity: 0.7,
    },
    registerText: {
        color: 'white',
        fontSize: hp(2),
        fontWeight: 'bold',
    },
});
