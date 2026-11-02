import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

interface OnboardingLayoutProps {
  step: number;
  totalSteps?: number;
  heading: string;
  subheading?: string;
  children: React.ReactNode;
  onContinue: () => void;
  continueLabel?: string;
  isContinueDisabled?: boolean;
  onBack?: () => void;
  showBack?: boolean;
  scrollable?: boolean;
}

export function OnboardingLayout({
  step,
  totalSteps = 10,
  heading,
  subheading,
  children,
  onContinue,
  continueLabel = 'Continue',
  isContinueDisabled = false,
  onBack,
  showBack = true,
  scrollable = false,
}: OnboardingLayoutProps) {
  const insets = useSafeAreaInsets();
  const progressPercent = Math.min(100, Math.max(0, (step / totalSteps) * 100));

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const ContentWrapper = scrollable ? ScrollView : View;
  const contentWrapperProps = scrollable
    ? {
        contentContainerStyle: styles.scrollContent,
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: 'handled' as const,
      }
    : { style: styles.staticContent };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}>
      {/* Top Edge-to-Edge Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Navigation Top Bar */}
      <View style={styles.topNav}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={handleBack}
            hitSlop={12}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
            <Text style={styles.backButtonIcon}>‹</Text>
          </Pressable>
        ) : (
          <View style={styles.navPlaceholder} />
        )}

        <Text style={styles.stepIndicatorText}>
          {step} of {totalSteps}
        </Text>
      </View>

      {/* Main Body */}
      <View style={styles.bodyContainer}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>{heading}</Text>
          {subheading ? <Text style={styles.subheading}>{subheading}</Text> : null}
        </View>

        {/* Dynamic Content */}
        <View style={styles.contentFlex}>
          <ContentWrapper {...contentWrapperProps}>{children}</ContentWrapper>
        </View>

        {/* Bottom Continue Action */}
        <View style={styles.bottomBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={continueLabel}
            disabled={isContinueDisabled}
            onPress={onContinue}
            style={({ pressed }) => [
              styles.continueButton,
              isContinueDisabled ? styles.continueButtonDisabled : styles.continueButtonActive,
              pressed && !isContinueDisabled && styles.continueButtonPressed,
            ]}>
            <Text
              style={[
                styles.continueButtonText,
                isContinueDisabled && styles.continueButtonTextDisabled,
              ]}>
              {continueLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#F3F4F6',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FD297B',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  topNav: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  backButtonPressed: {
    backgroundColor: '#F3F4F6',
    transform: [{ scale: 0.95 }],
  },
  backButtonIcon: {
    fontSize: 28,
    lineHeight: 32,
    color: '#18181B',
    fontWeight: '300',
    marginTop: -2,
  },
  navPlaceholder: {
    width: 36,
  },
  stepIndicatorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A1A1AA',
    letterSpacing: 0.3,
  },
  bodyContainer: {
    flex: 1,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  headerBlock: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  subheading: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
    lineHeight: 20,
    marginTop: 8,
  },
  contentFlex: {
    flex: 1,
  },
  staticContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomBar: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  continueButton: {
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  continueButtonActive: {
    backgroundColor: '#FD297B',
    shadowColor: '#FD297B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#F4F4F5',
  },
  continueButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  continueButtonTextDisabled: {
    color: '#A1A1AA',
  },
});

