import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '@/src/shared/api/services/profile.service';
import { UpdateProfileInfoType } from '@/src/shared/model/types/profile.types';
import { RefObject } from 'react';
import FlashMessage from 'react-native-flash-message';

export const useUpdateProfile = (toastRef: RefObject<FlashMessage>) => {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending } = useMutation({
    mutationKey: ['update profile info'],
    mutationFn: (data: UpdateProfileInfoType) => ProfileService.updateProfile(data),
    onSuccess() {
      toastRef?.current?.showMessage({
        message: 'You successfully updated profile',
        type: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });

  return { updateProfile, isPending };
};
