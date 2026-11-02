import React, { useRef, useEffect } from 'react';
import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native';
import { router } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useOnboarding } from '@/context/onboarding-context';

export default function LastNameScreen() {
  const { data, setLastName } = useOnboarding();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const isValid = data.lastName.trim().length > 0;

  const handleContinue = () => {
    if (isValid) {
      router.push('/onboarding/birthday');
    }
  };

  return (
    <OnboardingLayout
      step={2}
      totalSteps={10}
      heading="What's your last name?"
      subheading="Only your first name and last initial will be visible to potential matches."
      onContinue={handleContinue}
      isContinueDisabled={!isValid}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          value={data.lastName}
          onChangeText={setLastName}
          placeholder="Enter last name"
          placeholderTextColor="#A1A1AA"
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={handleContinue}
          style={styles.input}
        />
        {data.lastName.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear text"
            onPress={() => setLastName('')}
            hitSlop={8}
            style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.helperNote}>Your full last name is kept private and secure.</Text>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#18181B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#18181B',
    paddingVertical: 4,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E4E4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#71717A',
  },
  helperNote: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#71717A',
  },
});
