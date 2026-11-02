import React, { useRef } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { router } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useOnboarding } from '@/context/onboarding-context';

export default function BirthdayScreen() {
  const { data, setBirthday, calculatedAge } = useOnboarding();
  const dayRef = useRef<any>(null);
  const monthRef = useRef<any>(null);
  const yearRef = useRef<any>(null);

  const handleDayChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2);
    setBirthday({ day: cleaned });
    if (cleaned.length === 2) {
      monthRef.current?.focus();
    }
  };

  const handleMonthChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2);
    setBirthday({ month: cleaned });
    if (cleaned.length === 2) {
      yearRef.current?.focus();
    }
  };

  const handleYearChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 4);
    setBirthday({ year: cleaned });
  };

  const isComplete =
    data.birthday.day.length === 2 &&
    data.birthday.month.length === 2 &&
    data.birthday.year.length === 4;

  const isValidAge = calculatedAge !== null && calculatedAge >= 18;

  const handleContinue = () => {
    if (isComplete && isValidAge) {
      router.push('/onboarding/gender');
    }
  };

  return (
    <OnboardingLayout
      step={3}
      totalSteps={10}
      heading="When's your birthday?"
      subheading="Your profile shows your age, not your date of birth."
      onContinue={handleContinue}
      isContinueDisabled={!isComplete || !isValidAge}>
      <View style={styles.container}>
        {/* Date Segment Inputs */}
        <View style={styles.segmentsRow}>
          {/* Day */}
          <View style={styles.segmentBlock}>
            <TextInput
              ref={dayRef}
              value={data.birthday.day}
              onChangeText={handleDayChange}
              placeholder="DD"
              placeholderTextColor="#A1A1AA"
              keyboardType="number-pad"
              maxLength={2}
              style={[
                styles.segmentInput,
                data.birthday.day.length > 0 && styles.segmentInputFilled,
              ]}
            />
            <Text style={styles.segmentLabel}>Day</Text>
          </View>

          <Text style={styles.divider}>/</Text>

          {/* Month */}
          <View style={styles.segmentBlock}>
            <TextInput
              ref={monthRef}
              value={data.birthday.month}
              onChangeText={handleMonthChange}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && data.birthday.month === '') {
                  dayRef.current?.focus();
                }
              }}
              placeholder="MM"
              placeholderTextColor="#A1A1AA"
              keyboardType="number-pad"
              maxLength={2}
              style={[
                styles.segmentInput,
                data.birthday.month.length > 0 && styles.segmentInputFilled,
              ]}
            />
            <Text style={styles.segmentLabel}>Month</Text>
          </View>

          <Text style={styles.divider}>/</Text>

          {/* Year */}
          <View style={[styles.segmentBlock, styles.yearBlock]}>
            <TextInput
              ref={yearRef}
              value={data.birthday.year}
              onChangeText={handleYearChange}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && data.birthday.year === '') {
                  monthRef.current?.focus();
                }
              }}
              placeholder="YYYY"
              placeholderTextColor="#A1A1AA"
              keyboardType="number-pad"
              maxLength={4}
              style={[
                styles.segmentInput,
                data.birthday.year.length > 0 && styles.segmentInputFilled,
              ]}
            />
            <Text style={styles.segmentLabel}>Year</Text>
          </View>
        </View>

        {/* Live Age Preview */}
        {calculatedAge !== null ? (
          <View
            style={[
              styles.ageBadge,
              calculatedAge >= 18 ? styles.ageBadgeValid : styles.ageBadgeInvalid,
            ]}>
            <Text
              style={[
                styles.ageBadgeText,
                calculatedAge >= 18 ? styles.ageBadgeTextValid : styles.ageBadgeTextInvalid,
              ]}>
              {calculatedAge >= 18
                ? `✓ You will appear as ${calculatedAge} years old`
                : '✕ You must be 18 or older to join Redint Dating'}
            </Text>
          </View>
        ) : (
          <Text style={styles.exampleText}>Example: 14 / 02 / 2001</Text>
        )}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  segmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  segmentBlock: {
    width: 68,
    alignItems: 'center',
  },
  yearBlock: {
    width: 100,
  },
  segmentInput: {
    width: '100%',
    fontSize: 28,
    fontWeight: '700',
    color: '#18181B',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#E4E4E7',
  },
  segmentInputFilled: {
    borderBottomColor: '#FD297B',
  },
  segmentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A1A1AA',
    marginTop: 6,
    textTransform: 'uppercase',
  },
  divider: {
    fontSize: 26,
    fontWeight: '300',
    color: '#D4D4D8',
    marginBottom: 20,
  },
  ageBadge: {
    marginTop: 28,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ageBadgeValid: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  ageBadgeInvalid: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  ageBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ageBadgeTextValid: {
    color: '#15803D',
  },
  ageBadgeTextInvalid: {
    color: '#B91C1C',
  },
  exampleText: {
    marginTop: 20,
    fontSize: 13,
    color: '#A1A1AA',
    fontStyle: 'italic',
  },
});
