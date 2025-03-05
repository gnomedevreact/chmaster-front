import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/src/shared/api/services/auth.service';
import Purchases from 'react-native-purchases';
import { router } from 'expo-router';
import { AuthHelpers } from '@/src/shared/lib/helpers/auth.helpers';
import { toast } from '@/src/shared/lib/utils/toast';
import { formatError } from '@/src/shared/lib/utils/formatError';
import { useEffect } from 'react';
import { useGlobalLoadingContext } from '@/src/screens/Auth/lib/context';
import { useProfileStore } from '@/src/core/lib/store/profile.store';
import { storage } from '@/src/core/lib/store/storage';

export const useCreateProfileMutation = () => {
  const { setIsGlobalLoading } = useGlobalLoadingContext();

  const setProfile = useProfileStore((state) => state.setProfileData);

  const { mutate: createProfileMutation, isPending: isPendingCreateProfile } =
    useMutation({
      mutationKey: ['create profile'],
      mutationFn: ({ userId }: { userId: string }) =>
        AuthService.createProfile({ userId }),
      async onSuccess({ data }) {
        try {
          const introPassed = storage.getBoolean('intro');

          await Purchases.logIn(data.id);
          setProfile(data);

          if (introPassed) {
            router.replace('/(tabs)');
          } else {
            router.replace('/intro');
          }
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

  useEffect(() => {
    if (isPendingCreateProfile) {
      setIsGlobalLoading(true);
    } else {
      setIsGlobalLoading(false);
    }
  }, [isPendingCreateProfile]);

  return { createProfileMutation, isPendingCreateProfile };
};
