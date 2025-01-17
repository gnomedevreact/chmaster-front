import { create } from 'zustand';
import { ProfileType } from '@/src/shared/model/types/profile.types';

interface ProfileState {
  profile: ProfileType | null;
  increase: (profile: ProfileType) => void;
}

const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  increase: (profile) => set((state) => ({ profile })),
}));
