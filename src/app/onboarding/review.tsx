import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useOnboarding } from '@/context/onboarding-context';

export default function ReviewScreen() {
  const { data, calculatedAge } = useOnboarding();

  const handleFinish = () => {
    router.push('/onboarding/complete');
  };

  const primaryPhoto = data.photos[0] || data.photos.find(Boolean) || null;
  const fullName = `${data.firstName} ${data.lastName}`.trim() || 'Your Name';
  const ageDisplay = calculatedAge ? `, ${calculatedAge}` : '';

  return (
    <OnboardingLayout
      step={10}
      totalSteps={10}
      heading="Your profile is taking shape"
      subheading="Here is how your profile will look to potential matches on Redint Dating."
      onContinue={handleFinish}
      continueLabel="Finish"
      scrollable
      isContinueDisabled={false}>
      <View style={styles.container}>
        {/* Profile Card Mockup */}
        <View style={styles.card}>
          {/* Main Photo Banner */}
          <View style={styles.photoContainer}>
            {primaryPhoto ? (
              <Image
                source={{ uri: primaryPhoto }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderIcon}>👤</Text>
                <Text style={styles.photoPlaceholderText}>No photo selected</Text>
              </View>
            )}

            {/* Gradient Overlay for name */}
            <View style={styles.photoOverlay}>
              <Text style={styles.nameHeader}>
                {fullName}
                <Text style={styles.ageText}>{ageDisplay}</Text>
              </Text>
              {data.gender ? (
                <Text style={styles.genderSub}>
                  {data.gender}
                  {data.showGenderOnProfile ? '' : ' (Hidden)'}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailsBody}>
            {/* Seeking / Looking For */}
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>👀</Text>
              <View style={styles.detailTextCol}>
                <Text style={styles.detailLabel}>Interested In</Text>
                <Text style={styles.detailValue}>
                  {data.interestedIn || 'Not specified'}
                </Text>
              </View>
            </View>

            {/* Dating Intentions */}
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🎯</Text>
              <View style={styles.detailTextCol}>
                <Text style={styles.detailLabel}>Looking For</Text>
                <Text style={styles.detailValue}>
                  {data.datingIntentions.length > 0
                    ? data.datingIntentions.join(' • ')
                    : 'Not specified'}
                </Text>
              </View>
            </View>

            {/* Sexual Orientation */}
            {data.sexualOrientation.length > 0 ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🌈</Text>
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailLabel}>Orientation</Text>
                  <Text style={styles.detailValue}>
                    {data.sexualOrientation.join(', ')}
                    {data.showOrientationOnProfile ? '' : ' (Hidden)'}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Interests Chips */}
            <View style={styles.interestsSection}>
              <Text style={styles.detailLabel}>Interests & Passions</Text>
              {data.interests.length > 0 ? (
                <View style={styles.chipsRow}>
                  {data.interests.map((interest) => (
                    <View key={interest} style={styles.chip}>
                      <Text style={styles.chipText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyNote}>No interests selected yet</Text>
              )}
            </View>

            {/* Mini Photo Strip */}
            <View style={styles.photosSection}>
              <Text style={styles.detailLabel}>Profile Photos</Text>
              <View style={styles.photoStrip}>
                {data.photos.map((photo, idx) => (
                  <View key={idx} style={styles.miniPhotoSlot}>
                    {photo ? (
                      <Image
                        source={{ uri: photo }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                      />
                    ) : (
                      <Text style={styles.miniEmptyIcon}>+</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Edit Tip */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit info"
          onPress={() => router.push('/onboarding/first-name')}
          style={styles.editTipRow}>
          <Text style={styles.editTipText}>Need to make changes? Tap to edit from start</Text>
        </Pressable>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  card: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  photoContainer: {
    height: 240,
    backgroundColor: '#18181B',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  photoPlaceholder: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderIcon: {
    fontSize: 48,
  },
  photoPlaceholderText: {
    color: '#A1A1AA',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
  photoOverlay: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  nameHeader: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  ageText: {
    fontWeight: '400',
  },
  genderSub: {
    fontSize: 13,
    color: '#F4F4F5',
    marginTop: 2,
    fontWeight: '500',
  },
  detailsBody: {
    padding: 20,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  detailTextCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A1A1AA',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181B',
    lineHeight: 20,
  },
  interestsSection: {
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  chip: {
    backgroundColor: '#FFF0F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  chipText: {
    color: '#FD297B',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyNote: {
    fontSize: 13,
    color: '#A1A1AA',
    fontStyle: 'italic',
    marginTop: 4,
  },
  photosSection: {
    marginTop: 4,
  },
  photoStrip: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  miniPhotoSlot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#F4F4F5',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  miniEmptyIcon: {
    color: '#A1A1AA',
    fontSize: 16,
    fontWeight: '600',
  },
  editTipRow: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  editTipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FD297B',
  },
});
