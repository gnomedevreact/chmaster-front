import { useQuery } from '@tanstack/react-query';
import { ProfileService } from '@/src/shared/api/services/profile.service';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGetProfile = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => ProfileService.getProfile(),
    select: ({ data }) => data,
  });

  useEffect(() => {
    const setProfile = async () => {
      const jsonProfile = JSON.stringify(profile);
      await AsyncStorage.setItem('profile', jsonProfile);
    };
    if (profile) {
      setProfile();
    }
  }, [profile]);
};
