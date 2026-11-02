import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import {
  INITIAL_SAMPLE_PROFILES,
  SampleProfile,
} from '@/data/sample-profiles';
import {
  DiscoveryFilterState,
  DiscoverySettingsModal,
  DEFAULT_FILTERS,
} from '@/components/discovery/discovery-settings-modal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 95;

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();

  // Filters state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<DiscoveryFilterState>(DEFAULT_FILTERS);

  // In-memory decision tracking
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [activeFeedbackToast, setActiveFeedbackToast] = useState<string | null>(null);

  // Filter profiles based on current filter settings
  const filteredProfiles = useMemo(() => {
    return INITIAL_SAMPLE_PROFILES.filter((p) => {
      // Age check
      if (p.age < filters.minAge || p.age > filters.maxAge) {
        if (!filters.expandAgeIfEmpty) return false;
      }
      // Distance check
      if (p.distanceKm > filters.maxDistanceKm) {
        if (!filters.expandDistanceIfEmpty) return false;
      }
      // Interested in check
      if (filters.interestedIn === 'Women' && p.gender !== 'Woman') return false;
      if (filters.interestedIn === 'Men' && p.gender !== 'Man') return false;
      // Verified only
      if (filters.verifiedOnly && !p.isVerified) return false;
      // Has bio only
      if (filters.hasBioOnly && (!p.bio || p.bio.trim().length === 0)) return false;

      return true;
    });
  }, [filters]);

  // Remaining profiles (excluding liked and rejected)
  const remainingProfiles = useMemo(() => {
    const dismissedSet = new Set([...likedIds, ...rejectedIds]);
    return filteredProfiles.filter((p) => !dismissedSet.has(p.id));
  }, [filteredProfiles, likedIds, rejectedIds]);

  // Current active top profile & next preview profile
  const currentProfile = remainingProfiles[0] || null;
  const nextProfile = remainingProfiles[1] || null;

  // Animation values for card pan and rotation
  const pan = useRef(new Animated.ValueXY()).current;
  const isAnimatingDecision = useRef(false);

  const showToast = (msg: string) => {
    setActiveFeedbackToast(msg);
    setTimeout(() => setActiveFeedbackToast(null), 900);
  };

  // Perform decision logic (unified for gestures and action buttons)
  const handleDecision = useCallback(
    (action: 'like' | 'reject') => {
      if (!currentProfile || isAnimatingDecision.current) return;
      isAnimatingDecision.current = true;

      const profileId = currentProfile.id;
      const targetX = action === 'like' ? SCREEN_WIDTH * 1.3 : -SCREEN_WIDTH * 1.3;

      Animated.timing(pan, {
        toValue: { x: targetX, y: 0 },
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        // Record decision in local in-memory state
        if (action === 'like') {
          setLikedIds((prev) => [...prev, profileId]);
        } else {
          setRejectedIds((prev) => [...prev, profileId]);
        }
        setHistory((prev) => [...prev, profileId]);

        // Reset pan position for incoming card
        pan.setValue({ x: 0, y: 0 });
        isAnimatingDecision.current = false;
      });
    },
    [currentProfile, pan]
  );

  // Rewind action (restores the last dismissed profile)
  const handleRewind = () => {
    if (history.length === 0 || isAnimatingDecision.current) {
      showToast('No actions to rewind');
      return;
    }
    const lastId = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setLikedIds((prev) => prev.filter((id) => id !== lastId));
    setRejectedIds((prev) => prev.filter((id) => id !== lastId));
    showToast('Profile Restored ↺');
  };

  // PanResponder covering the ENTIRE visible card surface
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_, gs) => {
          return Math.abs(gs.dx) > 6 && Math.abs(gs.dx) > Math.abs(gs.dy);
        },
        onMoveShouldSetPanResponderCapture: (_, gs) => {
          // Immediately captures horizontal swipes regardless of where on the card the touch started
          return Math.abs(gs.dx) > 6 && Math.abs(gs.dx) > Math.abs(gs.dy);
        },
        onPanResponderGrant: () => {
          pan.setOffset({
            x: (pan.x as any)._value,
            y: (pan.y as any)._value,
          });
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gestureState) => {
          pan.flattenOffset();

          // Threshold or fling velocity check
          if (gestureState.dx > SWIPE_THRESHOLD || gestureState.vx > 0.5) {
            handleDecision('like');
          } else if (
            gestureState.dx < -SWIPE_THRESHOLD ||
            gestureState.vx < -0.5
          ) {
            handleDecision('reject');
          } else {
            // Spring back smoothly to origin
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              friction: 6,
              tension: 50,
              useNativeDriver: true,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          pan.flattenOffset();
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 6,
            tension: 50,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [pan, handleDecision]
  );

  // Interpolated card rotation
  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-18deg', '0deg', '18deg'],
    extrapolate: 'clamp',
  });

  // Stamp indicator opacities
  const likeOpacity = pan.x.interpolate({
    inputRange: [15, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-80, -15],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Next card scale animation as top card is dragged
  const nextCardScale = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [1, 0.94, 1],
    extrapolate: 'clamp',
  });

  // Reset entire demo
  const handleResetDemo = () => {
    setLikedIds([]);
    setRejectedIds([]);
    setHistory([]);
    setFilters(DEFAULT_FILTERS);
    pan.setValue({ x: 0, y: 0 });
    showToast('Demo Reset');
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, 14),
          paddingBottom: 0,
        },
      ]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Left: Filter / Preferences icon */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Discovery filters"
          onPress={() => setFilterModalVisible(true)}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
          <View style={styles.filterIconGraphic}>
            <View style={styles.filterLine1} />
            <View style={styles.filterDot1} />
            <View style={styles.filterLine2} />
            <View style={styles.filterDot2} />
          </View>
        </Pressable>

        {/* Center: Brand Wordmark */}
        <View style={styles.brandTitleRow}>
          <Image
            source={require('@/assets/images/redint-logo.png')}
            style={styles.brandEmblem}
            contentFit="contain"
          />
          <Text style={styles.brandTitle}>redint</Text>
        </View>

        {/* Right: Likes Screen Navigation (Replacing previous notification bell) */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View Likes"
          onPress={() => router.push('/(drawer)/(tabs)/likes' as any)}
          style={({ pressed }) => [
            styles.iconButton,
            styles.likesHeaderButton,
            pressed && styles.iconButtonPressed,
          ]}>
          <FontAwesome name="heart-o" size={24} color="black" />
          {likedIds.length > 0 ? (
            <View style={styles.likesBadge}>
              <Text style={styles.likesBadgeText}>{likedIds.length}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {/* Main Profile Deck Area */}
      <View style={styles.cardContainer}>
        {currentProfile ? (
          <View style={styles.deckWrapper}>
            {/* Background / Next Preview Card */}
            {nextProfile ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.card,
                  styles.nextCard,
                  { transform: [{ scale: nextCardScale }] },
                ]}>
                <Image
                  source={nextProfile.image}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <View style={styles.cardOverlay}>
                  <Text style={styles.profileName}>
                    {nextProfile.name}{' '}
                    <Text style={styles.profileAge}>{nextProfile.age}</Text>
                  </Text>
                  <Text style={styles.profileSubtitle}>
                    {nextProfile.profession} • {nextProfile.distanceKm} km away
                  </Text>
                </View>
              </Animated.View>
            ) : null}

            {/* Front Swipeable Card (Covers entire visible area) */}
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.card,
                styles.frontCard,
                {
                  transform: [
                    { translateX: pan.x },
                    { translateY: pan.y },
                    { rotate },
                  ],
                },
              ]}>
              {/* Local Offline Portrait Image */}
              <Image
                source={currentProfile.image}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                priority="high"
                pointerEvents="none"
              />

              {/* LIKE Stamp Indicator (Top Left) */}
              <Animated.View
                pointerEvents="none"
                style={[styles.stampLike, { opacity: likeOpacity }]}>
                <Text style={styles.stampLikeText}>LIKE</Text>
              </Animated.View>

              {/* NOPE Stamp Indicator (Top Right) */}
              <Animated.View
                pointerEvents="none"
                style={[styles.stampNope, { opacity: nopeOpacity }]}>
                <Text style={styles.stampNopeText}>NOPE</Text>
              </Animated.View>

              {/* Verification Badge */}
              {currentProfile.isVerified ? (
                <View pointerEvents="none" style={styles.scallopBadge}>
                  <Text style={styles.scallopCheck}>✓</Text>
                </View>
              ) : null}

              {/* Bottom Dark Gradient / Text Overlay (pointerEvents="none" ensures full surface swiping) */}
              <View pointerEvents="none" style={styles.cardOverlay}>
                <View style={styles.nameRow}>
                  <Text style={styles.profileName}>
                    {currentProfile.name}{' '}
                    <Text style={styles.profileAge}>{currentProfile.age}</Text>
                  </Text>
                  {currentProfile.isVerified ? (
                    <View style={styles.verifiedPill}>
                      <Text style={styles.verifiedPillCheck}>✓</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.profileSubtitle}>
                  {currentProfile.profession} • {currentProfile.distanceKm} km away
                </Text>

                <Text style={styles.profileBio} numberOfLines={2}>
                  {currentProfile.bio}
                </Text>
              </View>
            </Animated.View>
          </View>
        ) : (
          /* Empty State when profiles are exhausted or no matches */
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>✨</Text>
            <Text style={styles.emptyTitle}>You’ve seen everyone for now</Text>
            <Text style={styles.emptySubtitle}>
              {filteredProfiles.length === 0
                ? 'No profiles match your current discovery settings. Try broadening your distance or age range.'
                : 'Check back soon for new profiles, or adjust your discovery settings to find more people!'}
            </Text>

            <View style={styles.emptyActionsRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Adjust filters"
                onPress={() => setFilterModalVisible(true)}
                style={styles.emptyFilterBtn}>
                <Text style={styles.emptyFilterBtnText}>Adjust Filters</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Restart demo"
                onPress={handleResetDemo}
                style={styles.emptyResetBtn}>
                <Text style={styles.emptyResetBtnText}>Restart Demo</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Floating Action Buttons Row (Positioned nicely above the liquid-glass bar) */}
        <View style={styles.actionsRow}>
          {/* 1. Rewind / Undo */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rewind action"
            onPress={handleRewind}
            style={({ pressed }) => [
              styles.actionButtonSmall,
              styles.rewindButton,
              pressed && styles.actionButtonPressed,
            ]}>
            <Text style={styles.rewindIcon}>↺</Text>
          </Pressable>

          {/* 2. Dislike / Pass (Swipes Left) */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dislike"
            onPress={() => handleDecision('reject')}
            disabled={!currentProfile}
            style={({ pressed }) => [
              styles.actionButtonMedium,
              styles.dislikeButton,
              !currentProfile && styles.actionButtonDisabled,
              pressed && styles.actionButtonPressed,
            ]}>
            <Text style={styles.dislikeIcon}>✕</Text>
          </Pressable>

          {/* 3. Standout / Instant Chat */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Direct Chat"
            onPress={() => showToast('Direct Spark Sent! 💬')}
            disabled={!currentProfile}
            style={({ pressed }) => [
              styles.actionButtonLarge,
              styles.chatButton,
              !currentProfile && styles.actionButtonDisabled,
              pressed && styles.actionButtonPressed,
            ]}>
            <Text style={styles.chatIcon}>💬</Text>
          </Pressable>

          {/* 4. Like (Swipes Right) */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Like"
            onPress={() => handleDecision('like')}
            disabled={!currentProfile}
            style={({ pressed }) => [
              styles.actionButtonMedium,
              styles.likeButton,
              !currentProfile && styles.actionButtonDisabled,
              pressed && styles.actionButtonPressed,
            ]}>
            <Text style={styles.likeIcon}>♥</Text>
          </Pressable>

          {/* 5. Boost / Super Like */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Super like"
            onPress={() => showToast('Super Like Sent! ⚡')}
            disabled={!currentProfile}
            style={({ pressed }) => [
              styles.actionButtonSmall,
              styles.boostButton,
              !currentProfile && styles.actionButtonDisabled,
              pressed && styles.actionButtonPressed,
            ]}>
            <Text style={styles.boostIcon}>⚡</Text>
          </Pressable>
        </View>
      </View>

      {/* Floating Feedback Toast */}
      {activeFeedbackToast ? (
        <View pointerEvents="none" style={styles.feedbackToast}>
          <Text style={styles.feedbackToastText}>{activeFeedbackToast}</Text>
        </View>
      ) : null}

      {/* Discovery Settings Modal */}
      <DiscoverySettingsModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          showToast('Filters Applied');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconButtonPressed: {
    backgroundColor: '#F3F4F6',
    transform: [{ scale: 0.95 }],
  },
  filterIconGraphic: {
    width: 18,
    height: 14,
    justifyContent: 'space-between',
    position: 'relative',
  },
  filterLine1: {
    height: 2,
    backgroundColor: '#18181B',
    borderRadius: 1,
    width: '100%',
  },
  filterDot1: {
    position: 'absolute',
    top: -2,
    left: 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#18181B',
  },
  filterLine2: {
    height: 2,
    backgroundColor: '#18181B',
    borderRadius: 1,
    width: '100%',
    marginTop: 8,
  },
  filterDot2: {
    position: 'absolute',
    top: 8,
    right: 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#18181B',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandEmblem: {
    width: 24,
    height: 24,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FD297B',
    letterSpacing: -0.5,
  },
  likesHeaderButton: {
    backgroundColor: '#FFF0F5',
  },
  likesHeaderHeart: {
    fontSize: 20,
    color: '#FD297B',
    fontWeight: '700',
    lineHeight: 22,
  },
  likesBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FD297B',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  likesBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  deckWrapper: {
    flex: 1,
    position: 'relative',
  },
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#18181B',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 6,
  },
  frontCard: {
    zIndex: 10,
  },
  nextCard: {
    zIndex: 5,
  },
  stampLike: {
    position: 'absolute',
    top: 36,
    left: 28,
    borderWidth: 4,
    borderColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 16,
    transform: [{ rotate: '-18deg' }],
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    zIndex: 20,
  },
  stampLikeText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#22C55E',
    letterSpacing: 2,
  },
  stampNope: {
    position: 'absolute',
    top: 36,
    right: 28,
    borderWidth: 4,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 16,
    transform: [{ rotate: '18deg' }],
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    zIndex: 20,
  },
  stampNopeText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 2,
  },
  scallopBadge: {
    position: 'absolute',
    top: 24,
    right: 18,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#06B6D4',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 15,
  },
  scallopCheck: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: -2,
  },
  cardOverlay: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  profileAge: {
    fontWeight: '400',
    fontSize: 26,
  },
  verifiedPill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedPillCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: -1,
  },
  profileSubtitle: {
    color: '#E4E4E7',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  profileBio: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  emptyCard: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E4E4E7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#18181B',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emptyActionsRow: {
    marginTop: 24,
    gap: 12,
    width: '100%',
    maxWidth: 280,
  },
  emptyFilterBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FD297B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyFilterBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyResetBtn: {
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E4E4E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyResetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#27272A',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 12,
    paddingBottom: 2,
  },
  actionButtonSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButtonMedium: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonLarge: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B55',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  actionButtonPressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.85,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
  rewindButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
  },
  rewindIcon: {
    color: '#F59E0B',
    fontSize: 22,
    fontWeight: '800',
  },
  dislikeButton: {
    backgroundColor: '#FF4458',
  },
  dislikeIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  chatButton: {
    backgroundColor: '#FF7A59',
  },
  chatIcon: {
    fontSize: 28,
  },
  likeButton: {
    backgroundColor: '#10B981',
  },
  likeIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  boostButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
  },
  boostIcon: {
    color: '#8B5CF6',
    fontSize: 20,
    fontWeight: '800',
  },
  feedbackToast: {
    position: 'absolute',
    top: '44%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 22,
    zIndex: 100,
  },
  feedbackToastText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
