import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface DiscoveryFilterState {
  interestedIn: 'Everyone' | 'Women' | 'Men';
  minAge: number;
  maxAge: number;
  maxDistanceKm: number;
  verifiedOnly: boolean;
  hasBioOnly: boolean;
  expandDistanceIfEmpty: boolean;
  expandAgeIfEmpty: boolean;
}

export const DEFAULT_FILTERS: DiscoveryFilterState = {
  interestedIn: 'Everyone',
  minAge: 18,
  maxAge: 35,
  maxDistanceKm: 30,
  verifiedOnly: false,
  hasBioOnly: false,
  expandDistanceIfEmpty: true,
  expandAgeIfEmpty: true,
};

interface DiscoverySettingsModalProps {
  visible: boolean;
  onClose: () => void;
  filters: DiscoveryFilterState;
  onApplyFilters: (filters: DiscoveryFilterState) => void;
}

const DISTANCE_PRESETS = [5, 10, 20, 30, 50, 100];

export function DiscoverySettingsModal({
  visible,
  onClose,
  filters,
  onApplyFilters,
}: DiscoverySettingsModalProps) {
  const insets = useSafeAreaInsets();
  const [localFilters, setLocalFilters] = useState<DiscoveryFilterState>(filters);

  // Sync when opened
  React.useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible, filters]);

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View
        style={[
          styles.modalContainer,
          {
            paddingTop: Platform.OS === 'android' ? Math.max(insets.top, 16) : 12,
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}>
        {/* Modal Top Bar */}
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close filters"
            onPress={onClose}
            hitSlop={12}
            style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </Pressable>

          <Text style={styles.modalTitle}>Discovery Settings</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Apply filters and close"
            onPress={handleApply}
            hitSlop={12}>
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        </View>

        {/* Scrollable Settings Form */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* SECTION 1: Maximum Distance */}
          <View style={styles.cardSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Maximum distance</Text>
              <Text style={styles.sectionValue}>{localFilters.maxDistanceKm} km</Text>
            </View>

            {/* Distance Preset Chips */}
            <View style={styles.presetChipsRow}>
              {DISTANCE_PRESETS.map((dist) => {
                const isSelected = localFilters.maxDistanceKm === dist;
                return (
                  <Pressable
                    key={dist}
                    accessibilityRole="button"
                    accessibilityLabel={`${dist} km`}
                    onPress={() =>
                      setLocalFilters((prev) => ({ ...prev, maxDistanceKm: dist }))
                    }
                    style={[
                      styles.presetChip,
                      isSelected && styles.presetChipSelected,
                    ]}>
                    <Text
                      style={[
                        styles.presetChipText,
                        isSelected && styles.presetChipTextSelected,
                      ]}>
                      {dist} km
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.divider} />

            <View style={styles.toggleRow}>
              <Text style={styles.toggleSubtext}>
                Show people slightly further away if I run out of matches
              </Text>
              <Switch
                value={localFilters.expandDistanceIfEmpty}
                onValueChange={(val) =>
                  setLocalFilters((prev) => ({ ...prev, expandDistanceIfEmpty: val }))
                }
                trackColor={{ false: '#E4E4E7', true: '#FD297B' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* SECTION 2: Interested in */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Interested in</Text>
            <View style={styles.interestedRow}>
              {(['Women', 'Men', 'Everyone'] as const).map((genderOption) => {
                const isSelected = localFilters.interestedIn === genderOption;
                return (
                  <Pressable
                    key={genderOption}
                    accessibilityRole="button"
                    accessibilityLabel={`Interested in ${genderOption}`}
                    onPress={() =>
                      setLocalFilters((prev) => ({ ...prev, interestedIn: genderOption }))
                    }
                    style={[
                      styles.genderChip,
                      isSelected && styles.genderChipSelected,
                    ]}>
                    <Text
                      style={[
                        styles.genderChipText,
                        isSelected && styles.genderChipTextSelected,
                      ]}>
                      {genderOption}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* SECTION 3: Age Range */}
          <View style={styles.cardSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Age range</Text>
              <Text style={styles.sectionValue}>
                {localFilters.minAge} - {localFilters.maxAge}
              </Text>
            </View>

            {/* Stepper Controls */}
            <View style={styles.ageControlsRow}>
              {/* Min Age Stepper */}
              <View style={styles.stepperBlock}>
                <Text style={styles.stepperLabel}>Min Age</Text>
                <View style={styles.stepperButtons}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Decrease min age"
                    onPress={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        minAge: Math.max(18, prev.minAge - 1),
                      }))
                    }
                    style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>−</Text>
                  </Pressable>
                  <Text style={styles.stepperValueText}>{localFilters.minAge}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Increase min age"
                    onPress={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        minAge: Math.min(prev.maxAge - 1, prev.minAge + 1),
                      }))
                    }
                    style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>

              {/* Max Age Stepper */}
              <View style={styles.stepperBlock}>
                <Text style={styles.stepperLabel}>Max Age</Text>
                <View style={styles.stepperButtons}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Decrease max age"
                    onPress={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        maxAge: Math.max(prev.minAge + 1, prev.maxAge - 1),
                      }))
                    }
                    style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>−</Text>
                  </Pressable>
                  <Text style={styles.stepperValueText}>{localFilters.maxAge}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Increase max age"
                    onPress={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        maxAge: Math.min(60, prev.maxAge + 1),
                      }))
                    }
                    style={styles.stepBtn}>
                    <Text style={styles.stepBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.toggleRow}>
              <Text style={styles.toggleSubtext}>
                Show people slightly out of my preferred age range
              </Text>
              <Switch
                value={localFilters.expandAgeIfEmpty}
                onValueChange={(val) =>
                  setLocalFilters((prev) => ({ ...prev, expandAgeIfEmpty: val }))
                }
                trackColor={{ false: '#E4E4E7', true: '#FD297B' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* SECTION 4: Additional Preferences */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Additional Preferences</Text>

            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <Text style={styles.switchTitle}>Verified profiles only</Text>
                <Text style={styles.switchSub}>
                  Only show members who have verified their photos
                </Text>
              </View>
              <Switch
                value={localFilters.verifiedOnly}
                onValueChange={(val) =>
                  setLocalFilters((prev) => ({ ...prev, verifiedOnly: val }))
                }
                trackColor={{ false: '#E4E4E7', true: '#FD297B' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchTextCol}>
                <Text style={styles.switchTitle}>Has a written bio</Text>
                <Text style={styles.switchSub}>
                  Prioritize people with an expressive biography
                </Text>
              </View>
              <Switch
                value={localFilters.hasBioOnly}
                onValueChange={(val) =>
                  setLocalFilters((prev) => ({ ...prev, hasBioOnly: val }))
                }
                trackColor={{ false: '#E4E4E7', true: '#FD297B' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.actionButtonsCol}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Show profiles"
              onPress={handleApply}
              style={({ pressed }) => [
                styles.applyBtn,
                pressed && styles.applyBtnPressed,
              ]}>
              <Text style={styles.applyBtnText}>Show Profiles</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset filters"
              onPress={handleReset}
              style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>Reset to Default</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#71717A',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#18181B',
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FD297B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181B',
  },
  sectionValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FD297B',
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  presetChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  presetChipSelected: {
    backgroundColor: '#FFF0F5',
    borderColor: '#FD297B',
  },
  presetChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#52525B',
  },
  presetChipTextSelected: {
    color: '#FD297B',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F4F4F5',
    marginVertical: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleSubtext: {
    flex: 1,
    fontSize: 13,
    color: '#71717A',
    lineHeight: 18,
  },
  interestedRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F5',
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
  },
  genderChipSelected: {
    backgroundColor: '#FFF0F5',
    borderColor: '#FD297B',
  },
  genderChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#52525B',
  },
  genderChipTextSelected: {
    color: '#FD297B',
    fontWeight: '700',
  },
  ageControlsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  stepperBlock: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  stepperLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  stepperButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4D4D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181B',
    lineHeight: 20,
  },
  stepperValueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
    minWidth: 28,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 6,
  },
  switchTextCol: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181B',
  },
  switchSub: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
    lineHeight: 16,
  },
  actionButtonsCol: {
    marginTop: 10,
    gap: 10,
    paddingBottom: 24,
  },
  applyBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FD297B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FD297B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  applyBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  resetBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
  },
});

