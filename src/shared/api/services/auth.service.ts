import { axiosClassic } from '@/src/core/lib/axios/config';
import { ProfileType } from '@/src/shared/model/types/profile.types';

export const AuthService = {
  async signUp(data: { email: string; password: string }) {
    return await axiosClassic.post<ProfileType>('/profiles/sign-up', data);
  },

  async createProfile({ userId }: { userId: string }) {
    return await axiosClassic.post<ProfileType>('/profiles/create', { userId });
  },
};
