import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ProfileType } from '@/src/shared/model/types/profile.types';
import { mmkvStorage } from '@/src/core/lib/store/storage';

type MyState = {
  profileData: ProfileType | null;
  setProfileData: (data: ProfileType | null) => void;
  clearProfileData: () => void;
};

export const useProfileStore = create<MyState>()(
  persist(
    (set) => ({
      profileData: null,
      setProfileData: (data: ProfileType | null) => set({ profileData: data }),
      clearProfileData: () => set({ profileData: null }),
    }),
    {
      name: 'profile',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
