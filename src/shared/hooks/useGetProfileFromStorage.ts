import { ProfileHelper } from '@/src/shared/lib/helpers/profile.helper';
import { useEffect, useState } from 'react';
import { ProfileType } from '@/src/shared/model/types/profile.types';

export const useGetProfileFromStorage = () => {
  const [profile, setProfile] = useState<ProfileType>();

  useEffect(() => {
    const getProfile = async () => {
      const storage_profile = await ProfileHelper.getProfile();
      setProfile(storage_profile);
    };

    getProfile();
  }, []);

  return { profile };
};
