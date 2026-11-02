import React, { createContext, useContext, useState, useMemo } from 'react';

export interface BirthdayState {
  day: string;
  month: string;
  year: string;
}

export interface OnboardingData {
  firstName: string;
  lastName: string;
  birthday: BirthdayState;
  gender: string;
  showGenderOnProfile: boolean;
  sexualOrientation: string[];
  showOrientationOnProfile: boolean;
  interestedIn: string;
  datingIntentions: string[];
  interests: string[];
  photos: (string | null)[]; // Max 4 slots
}

interface OnboardingContextValue {
  data: OnboardingData;
  setFirstName: (val: string) => void;
  setLastName: (val: string) => void;
  setBirthday: (val: Partial<BirthdayState>) => void;
  setGender: (val: string) => void;
  setShowGenderOnProfile: (val: boolean) => void;
  toggleSexualOrientation: (val: string) => void;
  setShowOrientationOnProfile: (val: boolean) => void;
  setInterestedIn: (val: string) => void;
  toggleDatingIntention: (val: string) => void;
  toggleInterest: (val: string) => void;
  togglePhotoSlot: (index: number) => void;
  calculatedAge: number | null;
  resetOnboarding: () => void;
}

// Sample curated portrait placeholders for the prototype demo
export const SAMPLE_PROTOTYPE_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
];

const INITIAL_DATA: OnboardingData = {
  firstName: '',
  lastName: '',
  birthday: { day: '', month: '', year: '' },
  gender: '',
  showGenderOnProfile: true,
  sexualOrientation: [],
  showOrientationOnProfile: true,
  interestedIn: '',
  datingIntentions: [],
  interests: [],
  photos: [null, null, null, null],
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);

  const setFirstName = (firstName: string) => setData((prev) => ({ ...prev, firstName }));
  const setLastName = (lastName: string) => setData((prev) => ({ ...prev, lastName }));

  const setBirthday = (bday: Partial<BirthdayState>) => {
    setData((prev) => ({
      ...prev,
      birthday: { ...prev.birthday, ...bday },
    }));
  };

  const setGender = (gender: string) => setData((prev) => ({ ...prev, gender }));
  const setShowGenderOnProfile = (showGenderOnProfile: boolean) =>
    setData((prev) => ({ ...prev, showGenderOnProfile }));

  const toggleSexualOrientation = (orientation: string) => {
    setData((prev) => {
      const exists = prev.sexualOrientation.includes(orientation);
      if (exists) {
        return {
          ...prev,
          sexualOrientation: prev.sexualOrientation.filter((o) => o !== orientation),
        };
      }
      return {
        ...prev,
        sexualOrientation: [...prev.sexualOrientation, orientation],
      };
    });
  };

  const setShowOrientationOnProfile = (showOrientationOnProfile: boolean) =>
    setData((prev) => ({ ...prev, showOrientationOnProfile }));

  const setInterestedIn = (interestedIn: string) => setData((prev) => ({ ...prev, interestedIn }));

  const toggleDatingIntention = (intention: string) => {
    setData((prev) => {
      const exists = prev.datingIntentions.includes(intention);
      if (exists) {
        return {
          ...prev,
          datingIntentions: prev.datingIntentions.filter((i) => i !== intention),
        };
      }
      return {
        ...prev,
        datingIntentions: [...prev.datingIntentions, intention],
      };
    });
  };

  const toggleInterest = (interest: string) => {
    setData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return {
          ...prev,
          interests: prev.interests.filter((i) => i !== interest),
        };
      }
      return {
        ...prev,
        interests: [...prev.interests, interest],
      };
    });
  };

  const togglePhotoSlot = (index: number) => {
    setData((prev) => {
      const newPhotos = [...prev.photos];
      if (newPhotos[index]) {
        newPhotos[index] = null;
      } else {
        newPhotos[index] = SAMPLE_PROTOTYPE_PHOTOS[index % SAMPLE_PROTOTYPE_PHOTOS.length];
      }
      return { ...prev, photos: newPhotos };
    });
  };

  const calculatedAge = useMemo(() => {
    const { day, month, year } = data.birthday;
    if (!day || !month || !year || year.length !== 4) return null;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10) - 1;
    const y = parseInt(year, 10);
    if (isNaN(d) || isNaN(m) || isNaN(y)) return null;

    const birthDate = new Date(y, m, d);
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 && age <= 120 ? age : null;
  }, [data.birthday]);

  const resetOnboarding = () => setData(INITIAL_DATA);

  return (
    <OnboardingContext.Provider
      value={{
        data,
        setFirstName,
        setLastName,
        setBirthday,
        setGender,
        setShowGenderOnProfile,
        toggleSexualOrientation,
        setShowOrientationOnProfile,
        setInterestedIn,
        toggleDatingIntention,
        toggleInterest,
        togglePhotoSlot,
        calculatedAge,
        resetOnboarding,
      }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

