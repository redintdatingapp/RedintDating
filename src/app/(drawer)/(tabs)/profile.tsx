import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOnboarding } from '@/context/onboarding-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { data, calculatedAge } = useOnboarding();

  const primaryPhoto =
    data.photos[0] ||
    data.photos.find(Boolean) ||
    require('@/assets/images/sample-profile.png');

  const displayName = data.firstName
    ? `${data.firstName}${data.lastName ? ` ${data.lastName[0]}.` : ''}`
    : 'Alex';

  const displayAge = calculatedAge ?? 24;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 20),
        paddingBottom: 20,
        paddingHorizontal: 20,
      }}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.subtitle}>Manage your dating presence and account preferences.</Text>
      </View>

      <View style={styles.avatarCard}>
        <View style={styles.avatarWrapper}>
          <Image
            source={typeof primaryPhoto === 'string' ? { uri: primaryPhoto } : primaryPhoto}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        </View>

        <Text style={styles.userName}>
          {displayName}, {displayAge}
        </Text>
        <Text style={styles.userRole}>
          {data.gender || 'Member'} • {data.interestedIn ? `Seeking ${data.interestedIn}` : 'Redint Dating'}
        </Text>

        <View style={styles.badgesRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>✓ Profile Active</Text>
          </View>
        </View>
      </View>

      {/* Settings Options List */}
      <View style={styles.menuSection}>
        <View style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>Discovery Settings</Text>
            <Text style={styles.menuSubtitle}>Location, distance range & age preferences</Text>
          </View>
        </View>

        <View style={styles.menuItem}>
          <Text style={styles.menuIcon}>🛡️</Text>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>Safety & Verification</Text>
            <Text style={styles.menuSubtitle}>Manage selfie verification and blocked contacts</Text>
          </View>
        </View>

        <View style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔒</Text>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>Privacy & Notifications</Text>
            <Text style={styles.menuSubtitle}>Control profile visibility and app alerts</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingVertical: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#71717A',
    marginTop: 4,
  },
  avatarCard: {
    marginTop: 10,
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    backgroundColor: '#E4E4E7',
    borderWidth: 3,
    borderColor: '#FD297B',
    marginBottom: 14,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#18181B',
  },
  userRole: {
    fontSize: 14,
    color: '#71717A',
    marginTop: 4,
    fontWeight: '500',
  },
  badgesRow: {
    marginTop: 14,
  },
  statusBadge: {
    backgroundColor: '#F0FDF4',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  menuSection: {
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181B',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
});

