import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LikesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to Discover"
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <View style={styles.headerTextCol}>
          <Text style={styles.title}>Likes</Text>
          <Text style={styles.subtitle}>See who liked your profile and spark a connection.</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.placeholderCard}>
          <View style={styles.heartCircle}>
            <Text style={styles.placeholderIcon}>♥</Text>
          </View>
          <Text style={styles.cardHeading}>Mutual Sparks & Likes</Text>
          <Text style={styles.cardSub}>
            People who like your profile will appear here. Swipe right on profiles in Discover to create sparks!
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Discover profiles"
            onPress={() => router.push('/(drawer)/(tabs)' as any)}
            style={({ pressed }) => [
              styles.discoverBtn,
              pressed && styles.discoverBtnPressed,
            ]}>
            <Text style={styles.discoverBtnText}>Start Discovering</Text>
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
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  backIcon: {
    fontSize: 26,
    color: '#18181B',
    lineHeight: 28,
    marginTop: -2,
  },
  headerTextCol: {
    flex: 1,
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  placeholderCard: {
    width: '100%',
    maxWidth: 380,
    padding: 30,
    borderRadius: 24,
    backgroundColor: '#FFF5F8',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    alignItems: 'center',
  },
  heartCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FD297B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#FD297B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  placeholderIcon: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FD297B',
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  discoverBtn: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    backgroundColor: '#FD297B',
    shadowColor: '#FD297B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  discoverBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  discoverBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
