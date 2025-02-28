import { useMutation } from '@tanstack/react-query';
import { ProfileService } from '@/src/shared/api/services/profile.service';
import { AuthHelpers } from '@/src/shared/lib/helpers/auth.helpers';
import { toast } from '@/src/shared/lib/utils/toast';
import { formatError } from '@/src/shared/lib/utils/formatError';

export const useDeleteAccount = () => {
  const { mutate: deleteAccount, isPending: isPendingDeletion } = useMutation({
    mutationKey: ['delete account'],
    mutationFn: () => ProfileService.deleteAccount(),
    async onSuccess() {
      await AuthHelpers.logout();
    },
    onError(error: any) {
      toast({
        type: 'danger',
        message: formatError(error.response),
      });
    },
  });

  return { deleteAccount, isPendingDeletion };
};
