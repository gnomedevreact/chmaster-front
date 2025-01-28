import { useQuery } from '@tanstack/react-query';
import { ProfileService } from '@/src/shared/api/services/profile.service';

export const useGetProfileRank = () => {
  const { data: rank } = useQuery({
    queryKey: ['rank'],
    queryFn: () => ProfileService.getProfileRank(),
    select: ({ data }) => data,
  });

  return { rank };
};
