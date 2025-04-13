import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { wp, hp } from '@/helper/common';
import { theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '@/components/Header';

const Leaderboard = () => {
    const flatListRef = useRef(null);
    const [highlightUser, setHighlightUser] = useState(false);

    // Logged-in user's details
    const loggedInUser = { id: 11, name: "Love Kumar", hours: 50, points: 300, rank: 11 };

    // Volunteers data
    const volunteers = [
        { id: 1, name: 'John Smith', hours: 156, points: 980, rank: 1 },
        { id: 2, name: 'Sarah Johnson', hours: 142, points: 890, rank: 2 },
        { id: 3, name: 'Michael Brown', hours: 138, points: 850, rank: 3 },
        { id: 4, name: 'Emily Davis', hours: 125, points: 780, rank: 4 },
        { id: 5, name: 'David Wilson', hours: 118, points: 740, rank: 5 },
        { id: 6, name: 'Lisa Anderson', hours: 112, points: 690, rank: 6 },
        { id: 7, name: 'James Taylor', hours: 105, points: 650, rank: 7 },
        { id: 8, name: 'Jessica White', hours: 98, points: 610, rank: 8 },
        { id: 9, name: 'Robert Martin', hours: 92, points: 580, rank: 9 },
        { id: 10, name: 'Jennifer Lee', hours: 88, points: 550, rank: 10 },
        { id: 12, name: 'Sophia Clark', hours: 82, points: 510, rank: 12 },
        { id: 13, name: 'Ethan Lewis', hours: 78, points: 490, rank: 13 },
    ];

    // Combine and sort volunteers by rank
    const updatedVolunteers = [...volunteers, loggedInUser].sort((a, b) => a.rank - b.rank);

    // Scroll to logged-in user's position
    const scrollToMyPosition = () => {
        const index = updatedVolunteers.findIndex(item => item.id === loggedInUser.id);
        if (flatListRef.current && index !== -1) {
            flatListRef.current.scrollToOffset({ offset: index * hp(7), animated: true });

            // Highlight user briefly
            setHighlightUser(true);
            setTimeout(() => setHighlightUser(false), 2000);
        }
    };

    // Render each leaderboard item
    const renderItem = ({ item }) => (
        <View style={[
            styles.leaderboardItem,
            item.id === loggedInUser.id && highlightUser ? styles.highlight : null
        ]}>
            <Text style={[styles.rank, item.rank <= 3 && styles.topRank]}>
                #{item.rank}
            </Text>

            <View style={styles.userInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.stats}>
                    {item.hours} hours • {item.points} points
                </Text>
            </View>

            {/* Show Trophy for Top 3 */}
            {item.rank <= 3 && (
                <MaterialCommunityIcons
                    name="trophy"
                    size={24}
                    color={
                        item.rank === 1 ? '#FFD700' : // Gold
                        item.rank === 2 ? '#C0C0C0' : // Silver
                        '#CD7F32' // Bronze
                    }
                />
            )}
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
            <ScreenWrapper>
            <View style={styles.container}>

                <View style={styles.header}>
                 <Header title="Leaderboard" mb={30} />
                </View>
                

                {/* Your Profile (Pinned at Top) */}
                <TouchableOpacity style={styles.myProfile} onPress={scrollToMyPosition}>
                    <Text style={styles.myProfileText}>Your Rank: #{loggedInUser.rank}</Text>
                    <Text style={styles.myProfileText}>
                        {loggedInUser.hours} hours • {loggedInUser.points} points
                    </Text>
                </TouchableOpacity>

                {/* Leaderboard List */}
                <FlatList
                    ref={flatListRef}
                    data={updatedVolunteers}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    getItemLayout={(data, index) => ({
                        length: hp(7),
                        offset: hp(7) * index,
                        index,
                    })}
                    initialNumToRender={15} // Render first 15 items for performance
                />
            </View>
        </ScreenWrapper>
        </View>
        
    );
};

export default Leaderboard;

const styles = StyleSheet.create({
    header:{
        paddingLeft: 10
    },
    container: {
        flex: 1,
    },
    myProfile: {
        backgroundColor: '#E6F7FF', // Light Blue Background
        padding: hp(2),
        borderRadius: theme.radius.md,
        marginHorizontal: wp(4),
        marginBottom: hp(2),
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    myProfileText: {
        fontSize: hp(2),
        fontWeight: '600',
        color: theme.colors.primary,
    },
    listContent: {
        padding: wp(4),
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        padding: hp(2),
        borderRadius: theme.radius.md,
        marginBottom: hp(1.5),
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    highlight: {
        backgroundColor: '#E6F7FF', // Light Blue for Professional Look
        borderWidth: 2,
        borderColor: '#1E90FF', // Soft Blue Border
    },
    rank: {
        fontSize: hp(2),
        fontWeight: '600',
        color: theme.colors.gray,
        width: wp(10),
        textAlign: 'center',
    },
    topRank: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: hp(2),
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: hp(0.5),
    },
    stats: {
        fontSize: hp(1.6),
        color: theme.colors.gray,
    },
});
