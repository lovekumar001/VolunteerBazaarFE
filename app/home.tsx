import { Alert, Pressable, StyleSheet, Text, View, TextInput, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useRouter } from 'expo-router';
import { wp, hp } from '@/helper/common';
import { theme } from '@/constants/theme';
import Icon from '@/assets/icons';
import { ENDPOINTS } from '@/helper/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Activity {
    id: number;
    name: string;
    organization: string;
    type: string;
}

// Edit theme to add missing properties
const extendedTheme = {
    ...theme,
    colors: {
        ...theme.colors,
        white: '#FFFFFF',
        black: '#000000',
    }
};

const Home = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('activities');
    const [activities, setActivities] = useState<Activity[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const ITEMS_PER_PAGE = 5;

    const fetchActivities = async (pageNumber = 1, shouldRefresh = false) => {
        if (isLoading || (!hasMoreData && !shouldRefresh)) return;
        
        try {
            setIsLoading(true);
            
            // Add page and limit parameters to the API call
            // In a real API, you would have something like:
            // const response = await fetch(`${ENDPOINTS.EVENTS}?page=${pageNumber}&limit=${ITEMS_PER_PAGE}`);
            
            // Since we don't have actual pagination in the API, we'll simulate it
            const response = await fetch(ENDPOINTS.EVENTS);
            const allData = await response.json();
            
            // Simulate pagination by slicing the data
            const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const paginatedData = allData.slice(0, endIndex); // Get data up to current page
            
            // Check if we've reached the end of the data
            setHasMoreData(endIndex < allData.length);
            
            // Format the data to match your UI structure
            const formattedData = paginatedData.map((item: any) => ({
                id: item.event_id,
                name: item.title,
                organization: `Org #${item.organization_id}`,
                type: 'activities'
            }));
            
            if (shouldRefresh || pageNumber === 1) {
                // If refreshing or loading first page, replace all data
                setActivities(formattedData);
                setPage(1);
            } else {
                // Otherwise append new data
                setActivities(prev => [...prev, ...formattedData.slice(prev.length)]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch activities.');
            console.error(error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchActivities(1, true);
    }, []);

    // Filter activities when search or tab changes
    useEffect(() => {
        const filtered = activities.filter(activity =>
            activity.type === activeTab &&
            (activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             activity.organization.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredActivities(filtered);
    }, [searchQuery, activeTab, activities]);

    const handleLoadMore = () => {
        if (!isLoading && hasMoreData) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchActivities(nextPage);
        }
    };

    const handleRefresh = () => {
        if (!isLoading) {
            setRefreshing(true);
            setHasMoreData(true);
            fetchActivities(1, true);
        }
    };

    const renderFooter = () => {
        if (!isLoading) return null;
        
        return (
            <View style={styles.loaderFooter}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading more events...</Text>
            </View>
        );
    };

    const renderEmpty = () => {
        if (isLoading && page === 1) return null;
        
        return (
            <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="calendar-blank" size={64} color={theme.colors.gray} />
                <Text style={styles.emptyText}>
                    {searchQuery 
                        ? "No events match your search" 
                        : "No events found. Pull down to refresh."}
                </Text>
            </View>
        );
    };

    const renderActivityItem = ({ item }: { item: Activity }) => (
        <View style={styles.activityItem}>
            <View style={styles.activityContent}>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.organizationName}>{item.organization}</Text>
            </View>
            <Pressable 
                style={styles.registerButton}
                onPress={() => router.push({ 
                    pathname: '/activityDetail', 
                    params: { id: item.id } 
                })}
            >
                <Text style={styles.registerButtonText}>Register</Text>
            </Pressable>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScreenWrapper>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>VolunteerBazaar</Text>
                        <View style={styles.icons}>
                            <Pressable 
                                onPress={() => router.push('/userEvents')} 
                                style={styles.myEventsButton}
                            >
                                <MaterialCommunityIcons name="calendar-check" size={hp(2)} color="white" />
                                <Text style={styles.myEventsText}>My Events</Text>
                            </Pressable>
                            <Pressable onPress={() => router.push('/leaderboard')} style={styles.leaderboardButton}>
                                <Text style={styles.leaderboardText}>Leaderboard</Text>
                            </Pressable>
                            <Pressable onPress={() => router.push('/profile')} style={styles.userIcon}>
                                <Icon name="user" size={hp(3.2)} strokewidth={2} color={theme.colors.text} />
                            </Pressable>
                        </View>
                    </View>

                    {/* Search Bar */}
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

                    {/* Tabs */}
                    <View style={styles.buttonContainer}>
                        {['activities', 'pending', 'incomplete'].map(tab => (
                            <Pressable
                                key={tab}
                                style={[
                                    styles.button,
                                    activeTab === tab && styles.activeButton
                                ]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={styles.buttonText}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Activity List */}
                    <FlatList
                        data={filteredActivities}
                        renderItem={renderActivityItem}
                        keyExtractor={item => item.id.toString()}
                        style={styles.activityList}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                        ListEmptyComponent={renderEmpty}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        contentContainerStyle={
                            filteredActivities.length === 0 ? { flex: 1 } : { paddingHorizontal: wp(4) }
                        }
                    />
                </View>
            </ScreenWrapper>
        </View>
    );
};

export default Home;

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
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
    myEventsButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        borderRadius: theme.radius.sm,
        marginRight: wp(2),
        flexDirection: 'row',
        alignItems: 'center',
    },
    myEventsText: {
        color: extendedTheme.colors.white,
        fontSize: hp(1.5),
        fontWeight: '500',
        marginLeft: wp(1),
    },
    leaderboardButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        borderRadius: theme.radius.sm,
    },
    leaderboardText: {
        color: extendedTheme.colors.white,
        fontSize: hp(1.5),
        fontWeight: '500',
    },
    userIcon: {
        padding: hp(1),
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
        borderWidth: 1,
        borderColor: theme.colors.gray,
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
    },
    activityItem: {
        backgroundColor: theme.colors.gray,
        padding: hp(2),
        borderRadius: theme.radius.md,
        marginBottom: hp(1),
        shadowColor: extendedTheme.colors.black,
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
        color: extendedTheme.colors.white,
        fontSize: hp(1.6),
        fontWeight: '500',
    },
    loaderFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: hp(2),
    },
    loadingText: {
        marginLeft: wp(2),
        fontSize: hp(1.6),
        color: theme.colors.textLight,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(5),
    },
    emptyText: {
        marginTop: hp(2),
        fontSize: hp(1.8),
        color: theme.colors.textLight,
        textAlign: 'center',
        paddingHorizontal: wp(5),
    },
});
