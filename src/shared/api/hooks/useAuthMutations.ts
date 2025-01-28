import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/src/shared/api/services/auth.service';
import { toast } from '@/src/shared/lib/utils/toast';
import { isAxiosError } from 'axios';
import { AuthHelpers } from '@/src/shared/lib/helpers/auth.helpers';
import { router } from 'expo-router';
import { useProfileStore } from '@/src/core/lib/store/profile.store';

export const useAuthMutations = () => {
  const setProfile = useProfileStore((state) => state.setProfileData);

  const { mutate: signUpMutation, isPending } = useMutation({
    mutationKey: ['signup'],
    mutationFn: (data: { email: string; password: string }) => AuthService.signUp(data),
    async onSuccess({ data }) {
      try {
        setProfile(data);
        router.replace('/(tabs)');
      } catch (error) {
        await AuthHelpers.logout();
      }
    },
    async onError(error) {
      toast({
        type: 'danger',
        message: isAxiosError(error) && error?.response?.data.response.message,
      });
    },
  });

  const { mutate: createProfileMutation, isPending: isPendingCreateProfile } =
    useMutation({
      mutationKey: ['create profile'],
      mutationFn: ({ userId }: { userId: string }) =>
        AuthService.createProfile({ userId }),
      async onSuccess({ data }) {
        console.log(data);
        try {
          setProfile(data);
          router.replace('/(tabs)');
        } catch (error) {
          await AuthHelpers.logout();
        }
      },
      async onError(error) {
        toast({
          type: 'danger',
          message: 'Something went wrong',
        });

        await AuthHelpers.logout();
      },
    });

  return { signUpMutation, isPending, createProfileMutation, isPendingCreateProfile };
};
