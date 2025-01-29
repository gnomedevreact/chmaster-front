import { axiosAuth } from '@/src/core/lib/axios/config';
import { ProfileType, UpdateProfileType } from '@/src/shared/model/types/profile.types';

export const ProfileService = {
  async getProfile() {
    return await axiosAuth.get<ProfileType>('/profiles/get-profile');
  },

  async getProfileRank() {
    return await axiosAuth.get<number>('/profiles/rank');
  },

  async updateStats(data: UpdateProfileType) {
    return await axiosAuth.post<ProfileType>('/profiles/stats-update', data);
  },

  async uploadAvatar(avatarUri: string) {
    return await axiosAuth.post<ProfileType>('/profiles/avatar-upload', { avatarUri });
  },
};
