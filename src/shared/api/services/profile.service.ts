import { axiosAuth } from '@/src/core/lib/axios/config';
import {
  ProfileType,
  UpdateProfileInfoType,
  UpdateProfileType,
} from '@/src/shared/model/types/profile.types';

export const ProfileService = {
  async getProfile() {
    return await axiosAuth.get<ProfileType>('/profiles/get-profile');
  },

  async getProfileRank() {
    return await axiosAuth.get<number>('/profiles/rank');
  },

  async updateStats(data: UpdateProfileType) {
    return await axiosAuth.put<ProfileType>('/profiles/stats-update', data);
  },

  async uploadAvatar(avatarUri: string) {
    return await axiosAuth.put<ProfileType>('/profiles/avatar-upload', { avatarUri });
  },

  async updateProfile(data: UpdateProfileInfoType) {
    return await axiosAuth.put('/profiles/update', data);
  },

  async getTopProfiles() {
    return await axiosAuth.get<ProfileType[]>('/profiles/top-profiles');
  },

  async resetTasks() {
    return await axiosAuth.post('/profiles/reset-tasks');
  },

  async deleteAccount() {
    return await axiosAuth.delete('/profiles/delete');
  },
};
