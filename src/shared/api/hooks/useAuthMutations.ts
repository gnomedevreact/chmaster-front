import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/src/shared/api/services/auth.service';
import { toast } from '@/src/shared/lib/utils/toast';
import { AuthHelpers } from '@/src/shared/lib/helpers/auth.helpers';
import { router } from 'expo-router';
import { useProfileStore } from '@/src/core/lib/store/profile.store';
import { formatError } from '@/src/shared/lib/utils/formatError';

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
    async onError(error: any) {
      toast({
        type: 'danger',
        message: formatError(error.response),
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
      async onError(error: any) {
        toast({
          type: 'danger',
          message: formatError(error.response),
        });

        await AuthHelpers.logout();
      },
    });

  return { signUpMutation, isPending, createProfileMutation, isPendingCreateProfile };
};
