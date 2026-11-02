import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useOnboarding } from '@/context/onboarding-context';

const ORIENTATION_OPTIONS = [
  'Straight',
  'Gay',
  'Lesbian',
  'Bisexual',
  'Pansexual',
  'Asexual',
  'Demisexual',
  'Queer',
  'Another orientation',
  'Prefer not to say',
];

export default function OrientationScreen() {
  const {
    data,
    toggleSexualOrientation,
    setShowOrientationOnProfile,
  } = useOnboarding();

  const handleContinue = () => {
    router.push('/onboarding/meet');
  };

  return (
    <OnboardingLayout
      step={5}
      totalSteps={10}
      heading="What's your sexual orientation?"
      subheading="Select all that apply. Sharing this is entirely optional."
      onContinue={handleContinue}
      scrollable
      isContinueDisabled={false}>
      <View style={styles.container}>
        <View style={styles.optionsList}>
          {ORIENTATION_OPTIONS.map((option) => {
            const isSelected = data.sexualOrientation.includes(option);
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityLabel={option}
                onPress={() => toggleSexualOrientation(option)}
                style={({ pressed }) => [
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                  pressed && styles.optionCardPressed,
                ]}>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option}
                </Text>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Checkbox toggle: Show orientation on profile */}
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Show my orientation on my profile"
          onPress={() => setShowOrientationOnProfile(!data.showOrientationOnProfile)}
          style={styles.profileToggleRow}>
          <View
            style={[
              styles.toggleBox,
              data.showOrientationOnProfile && styles.toggleBoxChecked,
            ]}>
            {data.showOrientationOnProfile ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.toggleLabel}>Show my orientation on my profile</Text>
        </Pressable>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  optionCardSelected: {
    borderColor: '#FD297B',
    backgroundColor: '#FFF5F8',
  },
  optionCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#27272A',
  },
  optionTextSelected: {
    color: '#FD297B',
    fontWeight: '700',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D4D4D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FD297B',
    borderColor: '#FD297B',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
  },
  profileToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  toggleBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#D4D4D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleBoxChecked: {
    backgroundColor: '#FD297B',
    borderColor: '#FD297B',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#52525B',
  },
});

