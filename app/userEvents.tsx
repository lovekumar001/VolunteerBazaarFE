import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import Header from '@/components/Header';
import { wp, hp } from '@/helper/common';
import { theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENDPOINTS } from '@/helper/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface EventData {
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
}

interface UserEvent {
  user_id: number;
  event_id: number;
  event: EventData;
}

const UserEvents = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          const id = parsedData.user_id || parsedData.id;
          setUserId(id);
          if (id) {
            fetchUserEvents(id);
          }
        } else {
          setLoading(false);
          Alert.alert('Error', 'User not logged in', [
            { text: 'Login', onPress: () => router.push('/login') },
            { text: 'Cancel', onPress: () => router.back(), style: 'cancel' }
          ]);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const fetchUserEvents = async (id: string | number) => {
    try {
      setLoading(true);
      const response = await fetch(ENDPOINTS.USER_EVENTS(id));
      
      if (!response.ok) {
        throw new Error('Failed to fetch user events');
      }
      
      const data = await response.json();
      setUserEvents(data);
    } catch (error) {
      console.error('Error fetching user events:', error);
      Alert.alert('Error', 'Failed to load your registered events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const time = new Date();
    time.setHours(parseInt(hours, 10));
    time.setMinutes(parseInt(minutes, 10));
    return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  const renderEventItem = ({ item }: { item: UserEvent }) => (
    <Pressable 
      style={styles.eventCard}
      onPress={() => router.push({ pathname: '/activityDetail', params: { id: item.event_id } })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.eventTitle}>{item.event.title}</Text>
        <View style={styles.organizationBadge}>
          <Text style={styles.organizationText}>Org #{item.event.organization_id}</Text>
        </View>
      </View>
      
      <View style={styles.eventDetails}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="calendar" size={18} color={theme.colors.primary} />
          <Text style={styles.detailText}>
            {formatDate(item.event.start_date)}
            {item.event.start_date !== item.event.end_date && 
              ` - ${formatDate(item.event.end_date)}`}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={theme.colors.primary} />
          <Text style={styles.detailText}>
            {formatTime(item.event.start_time)} - {formatTime(item.event.end_time)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="map-marker" size={18} color={theme.colors.primary} />
          <Text style={styles.detailText}>City #{item.event.city_id}</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.primary} />
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenWrapper>
        <Header title="My Registered Events" mb={20} />
        
        {userEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={64} color={theme.colors.gray} />
            <Text style={styles.emptyText}>You haven't registered for any events yet</Text>
            <Pressable 
              style={styles.browseButton}
              onPress={() => router.push('/home')}
            >
              <Text style={styles.browseButtonText}>Browse Events</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={userEvents}
            renderItem={renderEventItem}
            keyExtractor={item => `${item.user_id}-${item.event_id}`}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScreenWrapper>
    </View>
  );
};

export default UserEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: hp(2),
    color: theme.colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  emptyText: {
    fontSize: hp(2),
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: hp(2),
    marginBottom: hp(3),
  },
  browseButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: theme.radius.md,
  },
  browseButtonText: {
    color: 'white',
    fontSize: hp(1.8),
    fontWeight: '600',
  },
  listContainer: {
    padding: wp(4),
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: theme.radius.lg,
    marginBottom: hp(2),
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  eventTitle: {
    flex: 1,
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: theme.colors.textDark,
    marginRight: wp(2),
  },
  organizationBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: theme.radius.md,
  },
  organizationText: {
    color: 'white',
    fontSize: hp(1.4),
    fontWeight: '500',
  },
  eventDetails: {
    marginBottom: hp(1.5),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  detailText: {
    marginLeft: wp(2),
    fontSize: hp(1.6),
    color: theme.colors.text,
  },
  cardFooter: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#EAECEF',
    paddingTop: hp(1),
  },
}); 