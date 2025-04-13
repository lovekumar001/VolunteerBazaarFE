import { Alert, Pressable, Button, StyleSheet, Text, View, Image, TextInput, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useRouter } from 'expo-router';
import { wp, hp } from '@/helper/common';
import { theme } from '@/constants/theme';
import Icon from '@/assets/icons';

const Home = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('activities');
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Dummy data - replace with API call
    useEffect(() => {
        const dummyActivities = [
            { id: 1, name: 'Beach Cleanup', organization: 'Ocean Care', type: 'activities' },
            { id: 2, name: 'Food Drive', organization: 'Food Bank', type: 'pending' && 'activities' },
            { id: 3, name: 'Tree Planting', organization: 'Green Earth', type: 'incomplete'&& 'activities' },
            { id: 4, name: 'Animal Shelter Help', organization: 'Pet Haven', type: 'pending'&& 'activities' },
            { id: 5, name: 'Senior Center Visit', organization: 'Elder Care', type: 'incomplete'&& 'activities' },
            { id: 6, name: 'Park Maintenance', organization: 'City Parks', type: 'pending'&& 'activities' },
            { id: 7, name: 'Blood Drive', organization: 'Red Cross', type: 'incomplete' && 'activities'},
            { id: 8, name: 'Homeless Shelter', organization: 'Hope Center', type: 'pending'&& 'activities' },
            { id: 9, name: 'Library Reading', organization: 'Public Library', type: 'incomplete'&& 'activities' },
            { id: 10, name: 'River Cleanup', organization: 'Water Watch', type: 'pending'&& 'activities' }
        ];
        setActivities(dummyActivities);
        setFilteredActivities(dummyActivities.filter(activity => activity.type === activeTab));
    }, []);

    useEffect(() => {
        const filtered = activities.filter(activity => 
            activity.type === activeTab &&
            (activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             activity.organization.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredActivities(filtered);
    }, [searchQuery, activeTab, activities]);

    const renderActivityItem = ({ item }) => (
        <View style={styles.activityItem}>
            <View style={styles.activityContent}>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.organizationName}>{item.organization}</Text>
            </View>
            <Pressable 
                style={styles.registerButton}
                onPress={() => router.push({ 
                    pathname: '/activityDetail', 
                    params: { name: item.name, organization: item.organization } 
                })}
            >
                <Text style={styles.registerButtonText}>Register</Text>
            </Pressable>
        </View>
    );
    

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
            <ScreenWrapper>
            <View style={styles.container}>
            <View style={styles.header}>
                    <Text style={styles.title}>VolunteerBazaar</Text>
                    <View style={styles.icons}>
                        {/* Leaderboard Button */}
                        <Pressable onPress={() => router.push('/leaderboard')} style={styles.leaderboardButton}>
                            <Text style={styles.leaderboardText}>Leaderboard</Text>
                        </Pressable>

                        {/* User Icon */}
                        <Pressable onPress={() => router.push('/profile')} style={styles.userIcon}>
                            <Icon name="user" size={hp(3.2)} strokewidth={2} color={theme.colors.text} />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Icon name="search" size={hp(2.5)} color={theme.colors.gray} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search activities..."
                            placeholderTextColor={theme.colors.gray}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable 
                        style={[styles.button, styles.activitiesButton, activeTab === 'activities' && styles.activeButton]}
                        onPress={() => setActiveTab('activities')}
                    >
                        <Text style={styles.buttonText}>Activities</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button, styles.pendingButton, activeTab === 'pending' && styles.activeButton]}
                        onPress={() => setActiveTab('pending')}
                    >
                        <Text style={styles.buttonText}>Pending</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button, styles.incompleteButton, activeTab === 'incomplete' && styles.activeButton]}
                        onPress={() => setActiveTab('incomplete')}
                    >
                        <Text style={styles.buttonText}>Incomplete</Text>
                    </Pressable>
                </View>

                
                <FlatList
                    data={filteredActivities}
                    renderItem={renderActivityItem}
                    keyExtractor={item => item.id.toString()}
                    style={styles.activityList}
                />
            </View>
        </ScreenWrapper>
        </View>
        
    );
};

export default Home;

const styles = StyleSheet.create({
    avatarImage: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderColor: theme.colors.gray,
        borderWidth: 3,
    },
    searchContainer: {
        paddingHorizontal: wp(4),
        marginBottom: hp(2),
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.radius.md,
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        borderWidth: 1,  // Added border width
        borderColor: theme.colors.gray,  // Added border color
    },
    searchInput: {
        flex: 1,
        marginLeft: wp(2),
        fontSize: hp(1.8),
        color: theme.colors.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: hp(2),
        paddingHorizontal: wp(4),
    },
    button: {
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.gray,
    },
    activeButton: {
        backgroundColor: theme.colors.primary,
    },
    buttonText: {
        color: theme.colors.text,
        fontSize: hp(1.8),
        fontWeight: '500',
    },
    activityList: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    activityItem: {
        backgroundColor: theme.colors.gray,
        padding: hp(2),
        borderRadius: theme.radius.md,
        marginBottom: hp(1),
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activityContent: {
        flex: 1,
    },
    activityName: {
        fontSize: hp(2),
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: hp(0.5),
    },
    organizationName: {
        fontSize: hp(1.6),
        color: theme.colors.primaryDark,
    },
    registerButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        borderRadius: theme.radius.sm,
        marginLeft: wp(2),
    },
    registerButtonText: {
        color: theme.colors.text,
        fontSize: hp(1.6),
        fontWeight: '500',
    },
    container: {
        flex: 1,
    },
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
});
