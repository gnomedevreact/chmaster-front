import { useMutation } from '@tanstack/react-query';
import { ProfileService } from '@/src/shared/api/services/profile.service';
import { UpdateProfileType } from '@/src/shared/model/types/profile.types';
import { toast } from '@/src/shared/lib/utils/toast';
import { isAxiosError } from 'axios';
import { useProfileStore } from '@/src/core/lib/store/profile.store';

export const useUpdateProfileStats = () => {
  const setProfile = useProfileStore((state) => state.setProfileData);

  const { mutate: updateStats } = useMutation({
    mutationKey: ['update stats'],
    mutationFn: (data: UpdateProfileType) => ProfileService.updateStats(data),
    onSuccess({ data }) {
      setProfile(data);
    },
    onError(error) {
      toast({
        type: 'danger',
        message: isAxiosError(error) && error?.response?.data.response.message,
      });
    },
  });

  return { updateStats };
};
