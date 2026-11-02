import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOnboarding } from '@/context/onboarding-context';

export default function CompleteScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useOnboarding();

  const handleContinue = () => {
    // Navigate to the main app interface replacing the route history
    router.replace('/(drawer)/(tabs)' as any);
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, 24) + 16,
          paddingBottom: Math.max(insets.bottom, 24) + 16,
        },
      ]}>
      {/* Content Container */}
      <View style={styles.contentCard}>
        {/* Spark Flame Emblem */}
        <View style={styles.badgeContainer}>
          <Image
            source={require('@/assets/images/redint-logo.png')}
            style={styles.logoImage}
            contentFit="contain"
          />
        </View>

        <Text style={styles.title}>You’re All Set!</Text>
        <Text style={styles.subtitle}>
          Welcome to Redint Dating{data.firstName ? `, ${data.firstName}` : ''}! Your profile is
          ready for finding genuine connections.
        </Text>

        <View style={styles.statsBox}>
          <Text style={styles.statsHeader}>Onboarding Completed</Text>
          <Text style={styles.statsItem}>✓ Name & details configured</Text>
          <Text style={styles.statsItem}>
            ✓ {data.interests.length > 0 ? `${data.interests.length} interests` : 'Interests'} selected
          </Text>
          <Text style={styles.statsItem}>✓ Profile pictures ready</Text>
          <Text style={styles.statsNotice}>
            * Ready to discover matches in your area.
          </Text>
        </View>

        {/* Primary Continue Button */}
        <View style={styles.actionsGroup}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue"
            onPress={handleContinue}
            style={({ pressed }) => [styles.continueButton, pressed && styles.buttonPressed]}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  contentCard: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  badgeContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FD297B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#FD297B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#18181B',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    paddingHorizontal: 12,
  },
  statsBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 20,
    marginTop: 28,
  },
  statsHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181B',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsItem: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
    marginBottom: 6,
  },
  statsNotice: {
    marginTop: 8,
    fontSize: 12,
    color: '#A1A1AA',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  actionsGroup: {
    width: '100%',
    marginTop: 32,
  },
  continueButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FD297B',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#FD297B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
