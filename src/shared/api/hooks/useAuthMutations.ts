import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/src/shared/api/services/auth.service';
import { toast } from '@/src/shared/lib/utils/toast';
import { isAxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthHelpers } from '@/src/shared/lib/helpers/auth.helpers';
import { router } from 'expo-router';

export const useAuthMutations = () => {
  const { mutate: signUpMutation, isPending } = useMutation({
    mutationKey: ['signup'],
    mutationFn: (data: { email: string; password: string }) => AuthService.signUp(data),
    async onSuccess({ data }) {
      try {
        const jsonProfile = JSON.stringify(data);
        await AsyncStorage.setItem('profile', jsonProfile);
        router.replace('/(tabs)');
      } catch (error) {
        await AuthHelpers.logout();
      }
    },
    onError(error) {
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
          const jsonProfile = JSON.stringify(data);
          await AsyncStorage.setItem('profile', jsonProfile);
          router.replace('/(tabs)');
        } catch (error) {
          await AuthHelpers.logout();
        }
      },
      async onError(error) {
        await AuthHelpers.logout();
        toast({
          type: 'danger',
          message: isAxiosError(error) && error?.response?.data.response.message,
        });
      },
    });

  return { signUpMutation, isPending, createProfileMutation, isPendingCreateProfile };
};
