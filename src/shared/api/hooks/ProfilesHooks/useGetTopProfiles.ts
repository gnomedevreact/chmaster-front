import { useQuery } from '@tanstack/react-query';
import { ProfileService } from '@/src/shared/api/services/profile.service';

export const useGetTopProfiles = () => {
  const { data: topProfiles, isLoading } = useQuery({
    queryKey: ['top profiles'],
    queryFn: () => ProfileService.getTopProfiles(),
    select: ({ data }) => data,
    staleTime: 1000 * 60 * 5,
  });

  return { topProfiles, isLoading };
};
