import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Direct conversations with your matches.</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderIcon}>💬</Text>
          <Text style={styles.cardHeading}>Say Something Real</Text>
          <Text style={styles.cardSub}>
            Your conversations with matched members will be kept private and safe right here.
          </Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  placeholderCard: {
    width: '100%',
    maxWidth: 380,
    padding: 28,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181B',
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

