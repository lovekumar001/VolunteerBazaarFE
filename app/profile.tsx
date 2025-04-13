import { StyleSheet, Alert, View, TouchableOpacity, Pressable, Text } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import { wp, hp } from '@/helper/common';
import { theme } from '@/constants/theme';
import Icon from '@/assets/icons';
import Avatar from '@/components/Avatar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Profile = () => {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Confirm', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Modal cancelled'),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => router.push('/login'),
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScreenWrapper>
      <UserHeader router={router} handleLogout={handleLogout} />
    </ScreenWrapper>
  );
};

const UserHeader = ({ router, handleLogout }) => {
  const username = "LOVE KUMAR";
  const email = "love.virjiani@gmail.com";
  const education = "Bachelor of Science";
  const phone = "+92 354569561";
  const address = "123 Volunteer Street, Mumbai";
  const skills = "First Aid, Teaching, Event Management";
  const volunteerStats = {
    hoursCompleted: 120,
    rating: 4.5,
    pointsEarned: 850
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
      <View>
        <Header title="Volunteer Profile" mb={30} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" color={theme.colors.rose} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar size={hp(12)} rounded={theme.radius.xxl * 1.4} uri={null} />
            <Pressable style={styles.editIcon} onPress={() => router.push('/editProfile')}>
              <Icon name="edit" strokeWidth={2.5} size={20} />
            </Pressable>
          </View>

          <View style={{alignItems: 'center', gap: 4}}>
            <Text style={styles.userName}>{username}</Text>
            <Text style={styles.volunteerTag}>Volunteer</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{volunteerStats.hoursCompleted}</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{volunteerStats.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{volunteerStats.pointsEarned}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.info}>
              <Icon name='mail' size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{email}</Text>
            </View>

            <View style={styles.info}>
              <Icon name='call' size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{phone}</Text>
            </View>

            <View style={styles.info}>
              <Icon name='location' size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{address}</Text>
            </View>

            <View style={styles.info}>
            <Icon name='plus' size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{skills}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: '#fee2e2',
  },
  container: {
    flex: 1,
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    backgroundColor: 'white',
    padding: 7,
    borderRadius: theme.radius.md,
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.background,
    padding: hp(2),
    borderRadius: theme.radius.lg,
    marginVertical: hp(2),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: hp(2.5),
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
    marginTop: 4,
  },
  infoSection: {
    gap: 12,
    backgroundColor: '#f8f9fa',
    padding: hp(2),
    borderRadius: theme.radius.lg,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: '500',
    color: theme.colors.textLight,
    flex: 1,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: '500',
    color: theme.colors.textDark,
  },
  volunteerTag: {
    fontSize: hp(1.8),
    color: theme.colors.primary,
    fontWeight: '500',
  },
});
