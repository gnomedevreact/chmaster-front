import { axiosAuth } from '@/src/core/lib/axios/config';
import { ProfileType } from '@/src/shared/model/types/profile.types';

export const ProfileService = {
  async getProfile() {
    return await axiosAuth.get<ProfileType>('/profiles/get-profile');
  },
};
