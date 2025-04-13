import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import BackButton from './BackButton';
import { wp, hp } from '@/helper/common';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';

const Header = ({ title, showBackButton = true, mb = 10 }) => {
  const router = useRouter();

  return (
    <View style={[styles.container, { marginBottom: mb }]}>
      {
        showBackButton && (
          <View style={styles.backButton}>
            <BackButton router={router} />
          </View>
        )
      }


      <Text style={styles.title}>{title || ''}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  title: {
    fontSize: hp(4),
    fontWeight: '600', // Changed to string for proper fontWeight
    color: theme.colors.textDark,
  },
  backButton: {
    position: 'absolute',
    left: 0
  }
});
