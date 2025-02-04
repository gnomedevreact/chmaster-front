import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '@/src/shared/api/services/profile.service';
import { UpdateProfileInfoType } from '@/src/shared/model/types/profile.types';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending } = useMutation({
    mutationKey: ['update profile info'],
    mutationFn: (data: UpdateProfileInfoType) => ProfileService.updateProfile(data),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });

  return { updateProfile, isPending };
};
