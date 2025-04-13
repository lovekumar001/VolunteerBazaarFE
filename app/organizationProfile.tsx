import { StyleSheet, Alert, View, TouchableOpacity, Pressable, Text } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import { wp, hp } from '@/helper/common';
import { theme } from '@/constants/theme';
import Icon from '@/assets/icons';
import Avatar from '@/components/Avatar';

const OrganizationProfile = () => {
  const router = useRouter();

  const organizationDetails = {
    name: "Helping Hands",
    email: "contact@helpinghands.org",
    phone: "+92 345678910",
    address: "456 Charity Lane, Karachi",
    rating: 4.8,
    completedActivities: 150,
    currentActivities: 10,
    totalActivities: 160,
    description: "Helping Hands is a non-profit organization dedicated to community service and social welfare.",
  };

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
        <Header title="Profile" mb={30} />

        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <Avatar size={hp(12)} rounded={theme.radius.xxl * 1.4} uri={null} />
          </View>

          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={styles.orgName}>{organizationDetails.name}</Text>
            <Text style={styles.rating}>⭐ {organizationDetails.rating} Rating</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{organizationDetails.completedActivities}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{organizationDetails.currentActivities}</Text>
              <Text style={styles.statLabel}>Ongoing</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{organizationDetails.totalActivities}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.info}>
              <Icon name='mail' size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{organizationDetails.email}</Text>
            </View>
            <View style={styles.info}>
              <Icon name='call' size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{organizationDetails.phone}</Text>
            </View>
            <View style={styles.info}>
              <Icon name='location' size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{organizationDetails.address}</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>About Us</Text>
            <Text style={styles.descriptionText}>{organizationDetails.description}</Text>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default OrganizationProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  orgName: {
    fontSize: hp(3),
    fontWeight: '500',
    color: theme.colors.textDark,
  },
  rating: {
    fontSize: hp(1.8),
    color: theme.colors.primary,
    fontWeight: '500',
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
  descriptionContainer: {
    marginTop: hp(2),
    padding: hp(2),
    backgroundColor: 'white',
    borderRadius: theme.radius.lg,
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  descriptionTitle: {
    fontSize: hp(2),
    fontWeight: '600',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: hp(1.7),
    color: theme.colors.textLight,
  },
});