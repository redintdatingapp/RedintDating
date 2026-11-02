import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useOnboarding } from '@/context/onboarding-context';

const GENDER_OPTIONS = [
  'Woman',
  'Man',
  'Non-binary',
  'Another identity',
  'Prefer not to say',
];

export default function GenderScreen() {
  const { data, setGender, setShowGenderOnProfile } = useOnboarding();

  const handleContinue = () => {
    if (data.gender) {
      router.push('/onboarding/orientation');
    }
  };

  return (
    <OnboardingLayout
      step={4}
      totalSteps={10}
      heading="What's your gender?"
      subheading="Select the option that best describes you."
      onContinue={handleContinue}
      isContinueDisabled={!data.gender}>
      <View style={styles.container}>
        <View style={styles.optionsList}>
          {GENDER_OPTIONS.map((option) => {
            const isSelected = data.gender === option;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityLabel={option}
                onPress={() => setGender(option)}
                style={({ pressed }) => [
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                  pressed && styles.optionCardPressed,
                ]}>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option}
                </Text>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected ? <View style={styles.radioInner} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Checkbox toggle: Show gender on profile */}
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Show my gender on my profile"
          onPress={() => setShowGenderOnProfile(!data.showGenderOnProfile)}
          style={styles.checkboxRow}>
          <View
            style={[
              styles.checkboxBox,
              data.showGenderOnProfile && styles.checkboxBoxChecked,
            ]}>
            {data.showGenderOnProfile ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.checkboxLabel}>Show my gender on my profile</Text>
        </Pressable>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#27272A',
  },
  optionTextSelected: {
    color: '#FD297B',
    fontWeight: '700',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D4D4D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#FD297B',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FD297B',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 16,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D4D4D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxBoxChecked: {
    backgroundColor: '#FD297B',
    borderColor: '#FD297B',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 14,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#52525B',
  },
});

