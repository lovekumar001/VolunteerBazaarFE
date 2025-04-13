import { Alert, Pressable, FlatList, StyleSheet, Text, View, Animated, PanResponder } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useRouter } from 'expo-router';
import { wp, hp } from '@/helper/common';
import { theme } from '@/constants/theme';
import Icon from '@/assets/icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const OrganizationHome = () => {
    const router = useRouter();
    const [activities, setActivities] = useState([]);
    const chatboxY = useRef(new Animated.Value(hp(100))).current;
    const [chatVisible, setChatVisible] = useState(false);
    
    useEffect(() => {
        // Dummy data - Replace with API Call
        const dummyActivities = [
            { id: 1, name: 'Beach Cleanup', status: 'Open' },
            { id: 2, name: 'Food Drive', status: 'Closed' },
            { id: 3, name: 'Tree Planting', status: 'Open' },
        ];
        setActivities(dummyActivities);
    }, []);
    
    const deleteActivity = (id) => {
        Alert.alert('Delete Activity', 'Are you sure you want to delete this activity?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: () => setActivities(activities.filter(a => a.id !== id)) }
        ]);
    };

    const toggleChatbox = () => {
        Animated.timing(chatboxY, {
            toValue: chatVisible ? hp(100) : hp(40),
            duration: 300,
            useNativeDriver: false,
        }).start();
        setChatVisible(!chatVisible);
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dy > 0 && chatVisible) {
                chatboxY.setValue(hp(40) + gestureState.dy);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy > 50) {
                toggleChatbox();
            } else {
                Animated.timing(chatboxY, {
                    toValue: hp(40),
                    duration: 200,
                    useNativeDriver: false,
                }).start();
            }
        }
    });

    const renderActivityItem = ({ item }) => (
        <View style={styles.activityItem}>
            <View>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.statusText}>Status: {item.status}</Text>
            </View>
            <View style={styles.actionButtons}>
                <Pressable onPress={() => router.push(`/editActivity?id=${item.id}`)}>
                    <Icon name="edit" size={hp(2.5)} color={theme.colors.primary} />
                </Pressable>
                <Pressable onPress={() => deleteActivity(item.id)}>
                    <MaterialCommunityIcons name="trash-can" size={hp(2.5)} color={theme.colors.rose} />
                </Pressable>
            </View>
        </View>
    );
    
    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(2) }}>
            <ScreenWrapper>
                <View style={styles.header}>
                    <Text style={styles.title}>VolunteerBazaar</Text>
                    <View style={styles.icons}>
                        <Pressable onPress={() => router.push('/leaderboard')} style={styles.leaderboardButton}>
                            <Text style={styles.leaderboardText}>Leaderboard</Text>
                        </Pressable>
                        <Pressable onPress={() => router.push('/organizationProfile')} style={styles.userIcon}>
                            <Icon name="user" size={hp(3.2)} strokewidth={2} color={theme.colors.text} />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Text style={styles.sectionTitle}>Your Activities</Text>
                    <Pressable style={styles.addButton} onPress={() => router.push('/addActivity')}>
                        <Icon name="plus" size={hp(3)} color={theme.colors.dark} />
                    </Pressable>
                </View>
                <FlatList
                    data={activities}
                    renderItem={renderActivityItem}
                    keyExtractor={item => item.id.toString()}
                    style={styles.activityList}
                />
            </ScreenWrapper>


            {/* Chatbot Button */}
            <Pressable style={styles.chatbotButton} onPress={toggleChatbox}>
                <MaterialCommunityIcons name="chat" size={hp(4)} color={theme.colors.white} />
            </Pressable>
            
            {/* Chatbox */}
            <Animated.View style={[styles.chatbox, { transform: [{ translateY: chatboxY }] }]} {...panResponder.panHandlers}>
                <View style={styles.chatboxHeader}>
                    <Text style={styles.chatboxTitle}>Chat with Us</Text>
                </View>
                <View style={styles.chatboxContent}>
                    <Text>Chatbot messages appear here...</Text>
                </View>
            </Animated.View>
        </View>
    );
};

export default OrganizationHome;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: wp(4),
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(3),
        fontWeight: 'bold',
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leaderboardButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        borderRadius: theme.radius.sm,
    },
    leaderboardText: {
        color: theme.colors.white,
        fontSize: hp(1.5),
        fontWeight: '500',
    },
    userIcon: {
        padding: hp(1),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: hp(2),
    },
    sectionTitle: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        padding: hp(1.5),
        borderRadius: theme.radius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityList: {
        flex: 1,
    },
    activityItem: {
        backgroundColor: theme.colors.gray,
        padding: hp(2),
        borderRadius: theme.radius.md,
        marginBottom: hp(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activityName: {
        fontSize: hp(2),
        fontWeight: '600',
        color: theme.colors.text,
    },
    statusText: {
        fontSize: hp(1.6),
        color: theme.colors.primaryDark,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: wp(3),
    }
    ,
    chatbotButton: {
        position: 'absolute',
        bottom: hp(5),
        right: wp(5),
        backgroundColor: theme.colors.primary,
        padding: hp(2),
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatbox: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: hp(60),
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    chatboxHeader: {
        padding: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    chatboxTitle: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
    },
    chatboxContent: {
        flex: 1,
        padding: hp(2),
    },
});
