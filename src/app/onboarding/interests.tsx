import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useOnboarding } from '@/context/onboarding-context';

interface InterestItem {
  id: string;
  label: string;
  icon: string;
}

const INTEREST_ITEMS: InterestItem[] = [
  { id: 'Music', label: 'Music', icon: '🎵' },
  { id: 'Movies and TV', label: 'Movies & TV', icon: '🎬' },
  { id: 'Travel', label: 'Travel', icon: '✈️' },
  { id: 'Food and dining', label: 'Food & dining', icon: '🍜' },
  { id: 'Fitness', label: 'Fitness', icon: '💪' },
  { id: 'Reading', label: 'Reading', icon: '📚' },
  { id: 'Gaming', label: 'Gaming', icon: '🎮' },
  { id: 'Art and design', label: 'Art & design', icon: '🎨' },
  { id: 'Photography', label: 'Photography', icon: '📷' },
  { id: 'Sports', label: 'Sports', icon: '⚽' },
  { id: 'Nature and outdoors', label: 'Nature & outdoors', icon: '🌲' },
  { id: 'Technology', label: 'Technology', icon: '💻' },
  { id: 'Fashion', label: 'Fashion', icon: '👗' },
  { id: 'Cooking', label: 'Cooking', icon: '🍳' },
  { id: 'Dancing', label: 'Dancing', icon: '💃' },
  { id: 'Animals and pets', label: 'Animals & pets', icon: '🐾' },
];

export default function InterestsScreen() {
  const { data, toggleInterest } = useOnboarding();

  const handleContinue = () => {
    if (data.interests.length > 0) {
      router.push('/onboarding/photos');
    }
  };

  return (
    <OnboardingLayout
      step={8}
      totalSteps={10}
      heading="What are you interested in?"
      subheading="Select your favorite hobbies and passions. Pick at least 3 for better matches."
      onContinue={handleContinue}
      scrollable
      isContinueDisabled={data.interests.length === 0}>
      <View style={styles.container}>
        {/* Count badge */}
        <View style={styles.counterRow}>
          <Text style={styles.counterText}>
            Selected:{' '}
            <Text style={styles.counterHighlight}>{data.interests.length}</Text>
          </Text>
        </View>

        {/* Chips grid */}
        <View style={styles.chipsContainer}>
          {INTEREST_ITEMS.map((item) => {
            const isSelected = data.interests.includes(item.id);
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => toggleInterest(item.id)}
                style={({ pressed }) => [
                  styles.chip,
                  isSelected && styles.chipSelected,
                  pressed && styles.chipPressed,
                ]}>
                <Text style={styles.chipIcon}>{item.icon}</Text>
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  counterRow: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  counterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717A',
  },
  counterHighlight: {
    color: '#FD297B',
    fontWeight: '700',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    borderColor: '#FD297B',
    backgroundColor: '#FFF5F8',
  },
  chipPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3F3F46',
  },
  chipTextSelected: {
    color: '#FD297B',
    fontWeight: '700',
  },
});

