import React, { useRef, useEffect } from 'react';
import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native';
import { router } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useOnboarding } from '@/context/onboarding-context';

export default function FirstNameScreen() {
  const { data, setFirstName } = useOnboarding();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const isValid = data.firstName.trim().length > 0;

  const handleContinue = () => {
    if (isValid) {
      router.push('/onboarding/last-name');
    }
  };

  return (
    <OnboardingLayout
      step={1}
      totalSteps={10}
      heading="What's your first name?"
      subheading="This is how it’ll appear on your profile. It helps personalise your experience."
      onContinue={handleContinue}
      isContinueDisabled={!isValid}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          value={data.firstName}
          onChangeText={setFirstName}
          placeholder="Enter first name"
          placeholderTextColor="#A1A1AA"
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={handleContinue}
          style={styles.input}
        />
        {data.firstName.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear text"
            onPress={() => setFirstName('')}
            hitSlop={8}
            style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.helperNote}>You can’t change this later.</Text>
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
    fontWeight: '600',
    color: '#71717A',
  },
});
