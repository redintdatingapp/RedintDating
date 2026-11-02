import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ExploreProfile {
  id: string;
  name: string;
  age: number;
  isVerified: boolean;
  image: any;
  goal?: string;        // for "Same dating goals" section
  sharedInterests?: string[]; // for "Similar interests" section
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const GOALS_PROFILES: ExploreProfile[] = [
  {
    id: 'g1',
    name: 'Anna',
    age: 25,
    isVerified: true,
    image: require('@/assets/images/profile-1.png'),
    goal: 'A long-term relationship',
  },
  {
    id: 'g2',
    name: 'Marcus',
    age: 28,
    isVerified: true,
    image: require('@/assets/images/profile-2.png'),
    goal: 'Marriage someday',
  },
  {
    id: 'g3',
    name: 'Elena',
    age: 23,
    isVerified: true,
    image: require('@/assets/images/profile-3.png'),
    goal: 'Something meaningful',
  },
  {
    id: 'g4',
    name: 'Sophia',
    age: 26,
    isVerified: true,
    image: require('@/assets/images/profile-5.png'),
    goal: 'A long-term relationship',
  },
];

const INTERESTS_PROFILES: ExploreProfile[] = [
  {
    id: 'i1',
    name: 'Liam',
    age: 30,
    isVerified: false,
    image: require('@/assets/images/profile-4.png'),
    sharedInterests: ['Fitness', 'Gaming'],
  },
  {
    id: 'i2',
    name: 'Kai',
    age: 27,
    isVerified: true,
    image: require('@/assets/images/profile-6.png'),
    sharedInterests: ['Art and design', 'Music'],
  },
  {
    id: 'i3',
    name: 'Sophia',
    age: 26,
    isVerified: true,
    image: require('@/assets/images/profile-5.png'),
    sharedInterests: ['Travel', 'Fitness'],
  },
  {
    id: 'i4',
    name: 'Anna',
    age: 25,
    isVerified: true,
    image: require('@/assets/images/profile-1.png'),
    sharedInterests: ['Photography', 'Food'],
  },
];

const { width: SCREEN_W } = Dimensions.get('window');
const GOAL_CARD_W = SCREEN_W * 0.56;
const INTEREST_CARD_W = (SCREEN_W - 20 * 2 - 12) / 2;

// ─── Sub-components ──────────────────────────────────────────────────────────

function GoalCard({ item, onLike }: { item: ExploreProfile; onLike: (id: string) => void }) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike(item.id);
  };

  return (
    <View style={styles.goalCard}>
      {/* Photo */}
      <View style={styles.goalPhotoWrapper}>
        <Image
          source={item.image}
          style={styles.goalPhoto}
          contentFit="cover"
        />
        {/* Goal badge overlay */}
        <View style={styles.goalBadge}>
          <Ionicons name="search" size={12} color="#333" />
          <Text style={styles.goalBadgeText} numberOfLines={1}>{item.goal}</Text>
        </View>
      </View>

      {/* Name row */}
      <View style={styles.goalNameRow}>
        <View style={styles.goalNameLeft}>
          <Text style={styles.goalName}>
            {item.name},{' '}
            <Text style={styles.goalAge}>{item.age}</Text>
          </Text>
          {item.isVerified && (
            <Ionicons name="checkmark-circle" size={15} color="#4A90D9" style={styles.verifiedIcon} />
          )}
        </View>
        <Pressable
          onPress={handleLike}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Like ${item.name}`}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={22}
            color={liked ? '#FD297B' : '#9CA3AF'}
          />
        </Pressable>
      </View>
    </View>
  );
}

function InterestCard({ item, onLike }: { item: ExploreProfile; onLike: (id: string) => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.interestCard}>
      <View style={styles.interestPhotoWrapper}>
        <Image
          source={item.image}
          style={styles.interestPhoto}
          contentFit="cover"
        />
        {/* Like button overlay */}
        <Pressable
          style={styles.interestLikeBtn}
          onPress={() => { setLiked(!liked); onLike(item.id); }}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Like ${item.name}`}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={18}
            color={liked ? '#FD297B' : '#FFFFFF'}
          />
        </Pressable>
      </View>

      {/* Info row */}
      <View style={styles.interestInfo}>
        <Text style={styles.interestName} numberOfLines={1}>
          {item.name}, {item.age}
          {item.isVerified && (
            <Text> </Text>
          )}
        </Text>
        {item.isVerified && (
          <Ionicons name="checkmark-circle" size={13} color="#4A90D9" />
        )}
      </View>
      {/* Shared interest tags */}
      {item.sharedInterests && item.sharedInterests.length > 0 && (
        <View style={styles.interestTagsRow}>
          {item.sharedInterests.slice(0, 2).map((tag) => (
            <View key={tag} style={styles.interestTag}>
              <Text style={styles.interestTagText} numberOfLines={1}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  const handleLike = (_id: string) => {
    // UI-only prototype — no backend interaction
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: 20,
      }}
      showsVerticalScrollIndicator={false}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Pressable
          style={styles.filterBtn}
          accessibilityRole="button"
          accessibilityLabel="Filter settings">
          <Ionicons name="options-outline" size={22} color="#1A1A1A" />
        </Pressable>
      </View>

      {/* ── Section 1: Same dating goals ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Same dating goals</Text>

        <FlatList
          data={GOALS_PROFILES}
          keyExtractor={(p) => p.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.goalsList}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <GoalCard item={item} onLike={handleLike} />
          )}
        />

        {/* Info note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
          <Text style={styles.infoNoteText}>Based on your profile and past matches</Text>
        </View>
      </View>

      {/* ── Section 2: Similar interests ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Similar interests</Text>

        <View style={styles.interestsGrid}>
          {INTERESTS_PROFILES.map((item) => (
            <InterestCard key={item.id} item={item} onLike={handleLike} />
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 4,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sections
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.2,
    marginBottom: 14,
    paddingHorizontal: 20,
  },

  // ── Goals cards (horizontal scroll) ──
  goalsList: {
    paddingHorizontal: 20,
  },
  goalCard: {
    width: GOAL_CARD_W,
  },
  goalPhotoWrapper: {
    width: GOAL_CARD_W,
    height: GOAL_CARD_W * 1.28,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
    marginBottom: 10,
  },
  goalPhoto: {
    width: '100%',
    height: '100%',
  },
  goalBadge: {
    position: 'absolute',
    bottom: 12,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.93)',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  goalBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  goalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  goalNameLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  goalName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  goalAge: {
    fontWeight: '500',
    color: '#1A1A1A',
  },
  verifiedIcon: {
    marginLeft: 2,
  },

  // Info note
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  infoNoteText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // ── Interests grid (2-column) ──
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  interestCard: {
    width: INTEREST_CARD_W,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  interestPhotoWrapper: {
    width: '100%',
    height: INTEREST_CARD_W * 1.2,
    backgroundColor: '#E5E5E5',
    position: 'relative',
  },
  interestPhoto: {
    width: '100%',
    height: '100%',
  },
  interestLikeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 4,
  },
  interestName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  interestTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  interestTag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  interestTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#555555',
  },
});
