import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useOnboarding } from '@/context/onboarding-context';

interface IntentionOption {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const INTENTIONS: IntentionOption[] = [
  {
    id: 'Long-term relationship',
    icon: '💍',
    title: 'Long-term relationship',
    description: 'Looking for a lasting, meaningful connection',
  },
  {
    id: 'Short-term relationship',
    icon: '✨',
    title: 'Short-term relationship',
    description: 'Open to dating and seeing where things go',
  },
  {
    id: 'Casual dating',
    icon: '🥂',
    title: 'Casual dating',
    description: 'Fun dates and meeting new people without pressure',
  },
  {
    id: 'Can be friends',
    icon: '👋',
    title: 'Can be friends',
    description: 'Expanding my social circle and meeting peers',
  },
  {
    id: 'Still figuring it out',
    icon: '💭',
    title: 'Still figuring it out',
    description: 'Open-minded and exploring what feels right',
  },
];

export default function IntentionsScreen() {
  const { data, toggleDatingIntention } = useOnboarding();

  const handleContinue = () => {
    if (data.datingIntentions.length > 0) {
      router.push('/onboarding/interests');
    }
  };

  return (
    <OnboardingLayout
      step={7}
      totalSteps={10}
      heading="What are you looking for?"
      subheading="Select your dating intentions. You can select more than one."
      onContinue={handleContinue}
      scrollable
      isContinueDisabled={data.datingIntentions.length === 0}>
      <View style={styles.container}>
        <View style={styles.cardsList}>
          {INTENTIONS.map((item) => {
            const isSelected = data.datingIntentions.includes(item.id);
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                onPress={() => toggleDatingIntention(item.id)}
                style={({ pressed }) => [
                  styles.card,
                  isSelected && styles.cardSelected,
                  pressed && styles.cardPressed,
                ]}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>

                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
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
    paddingTop: 12,
  },
  cardsList: {
    gap: 12,
  },
  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#FD297B',
    backgroundColor: '#FFF5F8',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181B',
  },
  cardTitleSelected: {
    color: '#FD297B',
  },
  cardDesc: {
    fontSize: 12.5,
    color: '#71717A',
    marginTop: 2,
    lineHeight: 16,
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
});

