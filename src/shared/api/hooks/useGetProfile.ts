import { useQuery } from '@tanstack/react-query';
import { ProfileService } from '@/src/shared/api/services/profile.service';
import { useEffect } from 'react';
import { useProfileStore } from '@/src/core/lib/store/profile.store';

export const useGetProfile = () => {
  const setProfile = useProfileStore((state) => state.setProfileData);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => ProfileService.getProfile(),
    select: ({ data }) => data,
  });

  useEffect(() => {
    if (profile) {
      setProfile(profile);
    }
  }, [profile]);
};
