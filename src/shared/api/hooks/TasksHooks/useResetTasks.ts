import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '@/src/shared/api/services/profile.service';
import { storage } from '@/src/core/lib/store/storage';
import { useTransition } from 'react';
import { toast } from '@/src/shared/lib/utils/toast';
import { formatError } from '@/src/shared/lib/utils/formatError';

export const useResetTasks = () => {
  const queryClient = useQueryClient();
  const [isPendingTransition, startTransition] = useTransition();

  const { mutate: resetTasks, isPending: isPendingReset } = useMutation({
    mutationKey: ['reset tasks'],
    mutationFn: () => ProfileService.resetTasks(),
    onSuccess() {
      startTransition(() => {
        storage.delete('puzzles');
        queryClient.invalidateQueries({
          queryKey: ['tasks'],
        });
        queryClient.invalidateQueries({
          queryKey: ['profile'],
        });
      });
    },
    onError(error: any) {
      toast({
        type: 'danger',
        message: formatError(error.response),
      });
    },
  });

  const isPending = isPendingReset || isPendingTransition;

  return { resetTasks, isPending };
};
