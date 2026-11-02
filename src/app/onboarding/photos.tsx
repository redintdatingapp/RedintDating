import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useOnboarding } from '@/context/onboarding-context';

export default function PhotosScreen() {
  const { data, togglePhotoSlot } = useOnboarding();

  const populatedCount = data.photos.filter(Boolean).length;
  const hasAtLeastOne = populatedCount > 0;

  const handleContinue = () => {
    if (hasAtLeastOne) {
      router.push('/onboarding/review');
    }
  };

  return (
    <OnboardingLayout
      step={9}
      totalSteps={10}
      heading="Add your profile pictures"
      subheading="Tap any slot to add or remove sample photos. Pick your best angles!"
      onContinue={handleContinue}
      scrollable
      isContinueDisabled={!hasAtLeastOne}>
      <View style={styles.container}>
        {/* Photo Grid - Exactly 4 Slots */}
        <View style={styles.grid}>
          {/* Main Primary Slot (Index 0) */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={data.photos[0] ? 'Remove main photo' : 'Add main photo'}
            onPress={() => togglePhotoSlot(0)}
            style={({ pressed }) => [
              styles.primarySlot,
              data.photos[0] ? styles.slotPopulated : styles.slotEmpty,
              pressed && styles.slotPressed,
            ]}>
            {data.photos[0] ? (
              <>
                <Image
                  source={{ uri: data.photos[0] }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryBadgeText}>★ Primary</Text>
                </View>
                <View style={styles.removeCircle}>
                  <Text style={styles.removeIcon}>✕</Text>
                </View>
              </>
            ) : (
              <View style={styles.emptySlotContent}>
                <View style={styles.addCirclePrimary}>
                  <Text style={styles.addIconPrimary}>+</Text>
                </View>
                <Text style={styles.primaryEmptyText}>Tap to add main photo</Text>
                <View style={styles.primaryBadgeEmpty}>
                  <Text style={styles.primaryBadgeEmptyText}>Main photo</Text>
                </View>
              </View>
            )}
          </Pressable>

          {/* 3 Secondary Slots (Indices 1, 2, 3) */}
          <View style={styles.secondaryRow}>
            {[1, 2, 3].map((idx) => {
              const photoUri = data.photos[idx];
              return (
                <Pressable
                  key={idx}
                  accessibilityRole="button"
                  accessibilityLabel={photoUri ? `Remove photo ${idx + 1}` : `Add photo ${idx + 1}`}
                  onPress={() => togglePhotoSlot(idx)}
                  style={({ pressed }) => [
                    styles.secondarySlot,
                    photoUri ? styles.slotPopulated : styles.slotEmpty,
                    pressed && styles.slotPressed,
                  ]}>
                  {photoUri ? (
                    <>
                      <Image
                        source={{ uri: photoUri }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                      />
                      <View style={styles.removeCircleSmall}>
                        <Text style={styles.removeIconSmall}>✕</Text>
                      </View>
                    </>
                  ) : (
                    <View style={styles.addCircleSmall}>
                      <Text style={styles.addIconSmall}>+</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Counter and Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>
            📸 {populatedCount} of 4 photos added
          </Text>
          <Text style={styles.tipText}>
            Tip: High-quality, clear photos showing your smile get 3x more meaningful connections!
          </Text>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  grid: {
    gap: 12,
  },
  primarySlot: {
    width: '100%',
    height: 230,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  secondarySlot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotEmpty: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E4E4E7',
    borderStyle: 'dashed',
  },
  slotPopulated: {
    backgroundColor: '#18181B',
    borderWidth: 1.5,
    borderColor: '#FD297B',
  },
  slotPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  emptySlotContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCirclePrimary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FD297B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addIconPrimary: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginTop: -2,
  },
  primaryEmptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
  },
  primaryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  primaryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  primaryBadgeEmpty: {
    marginTop: 8,
    backgroundColor: '#F4F4F5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  primaryBadgeEmptyText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
  },
  removeCircle: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  addCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#D4D4D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconSmall: {
    color: '#71717A',
    fontSize: 18,
    fontWeight: '600',
    marginTop: -1,
  },
  removeCircleSmall: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIconSmall: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  tipCard: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#27272A',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#71717A',
    lineHeight: 16,
  },
});

