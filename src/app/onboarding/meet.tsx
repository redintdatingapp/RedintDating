import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useOnboarding } from '@/context/onboarding-context';

const MEET_OPTIONS = [
  { id: 'Women', label: 'Women', subtitle: 'Show women on your discovery deck' },
  { id: 'Men', label: 'Men', subtitle: 'Show men on your discovery deck' },
  { id: 'Everyone', label: 'Everyone', subtitle: 'Show people of all genders' },
];

export default function MeetScreen() {
  const { data, setInterestedIn } = useOnboarding();

  const handleContinue = () => {
    if (data.interestedIn) {
      router.push('/onboarding/intentions');
    }
  };

  return (
    <OnboardingLayout
      step={6}
      totalSteps={10}
      heading="Who would you like to meet?"
      subheading="Choose who you’d like to see on Redint Dating. You can update this anytime."
      onContinue={handleContinue}
      isContinueDisabled={!data.interestedIn}>
      <View style={styles.container}>
        <View style={styles.optionsList}>
          {MEET_OPTIONS.map((item) => {
            const isSelected = data.interestedIn === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => setInterestedIn(item.id)}
                style={({ pressed }) => [
                  styles.card,
                  isSelected && styles.cardSelected,
                  pressed && styles.cardPressed,
                ]}>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {item.label}
                  </Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={[styles.indicator, isSelected && styles.indicatorSelected]}>
                  {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
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
    paddingTop: 16,
  },
  optionsList: {
    gap: 14,
  },
  card: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardSelected: {
    borderColor: '#FD297B',
    backgroundColor: '#FFF5F8',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  cardContent: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181B',
  },
  cardTitleSelected: {
    color: '#FD297B',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#71717A',
    marginTop: 4,
  },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D4D4D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorSelected: {
    backgroundColor: '#FD297B',
    borderColor: '#FD297B',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 15,
  },
});

