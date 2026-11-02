import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Radiant Gradient Background */}
      <Image
        source={require('@/assets/images/welcome-bg.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        priority="high"
      />

      {/* Main Content with Safe Area insets */}
      <View
        style={[
          styles.contentWrapper,
          {
            paddingTop: Math.max(insets.top, 20) + 12,
            paddingBottom: Math.max(insets.bottom, 20) + 12,
          },
        ]}>
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Image
            source={require('@/assets/images/redint-logo.png')}
            style={styles.brandIcon}
            contentFit="contain"
          />
          <Text style={styles.brandTitle}>redint dating</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroHeadline}>
            It starts with{'\n'}a Spark™
          </Text>
          <Text style={styles.heroSubheadline}>
            Connect with people who match your energy.
          </Text>
        </View>

        {/* Bottom Actions & Legal Disclaimer */}
        <View style={styles.bottomSection}>
          <Text style={styles.termsText}>
            By tapping “Continue with Google”, you agree to our{' '}
            <Text style={styles.termsLink}>Terms</Text>. Learn how we process your data in our{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text> and{' '}
            <Text style={styles.termsLink}>Cookies Policy</Text>.
          </Text>

          {/* Continue with Google Action Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            onPress={() => {
              router.push('/onboarding/first-name');
            }}
            style={({ pressed }) => [
              styles.googleButton,
              pressed && styles.googleButtonPressed,
            ]}>
            <Image
              source={require('@/assets/images/google-logo.png')}
              style={styles.googleIcon}
              contentFit="contain"
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>

          {/* Trouble signing in link */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Trouble signing in"
            onPress={() => {
              // UI only
            }}
            style={({ pressed }) => [
              styles.troubleLink,
              pressed && styles.troubleLinkPressed,
            ]}>
            <Text style={styles.troubleLinkText}>Trouble signing in?</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FD297B',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 32,
    height: 32,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  heroHeadline: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 48,
    textAlign: 'center',
    letterSpacing: -0.6,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  heroSubheadline: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 14,
    maxWidth: 290,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  termsText: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  termsLink: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  googleButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  googleButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  troubleLink: {
    marginTop: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  troubleLinkPressed: {
    opacity: 0.7,
  },
  troubleLinkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
