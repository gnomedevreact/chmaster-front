import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExercisesService } from '@/src/shared/api/services/exercises.service';
import { toast } from '@/src/shared/lib/utils/toast';
import { useTransition } from 'react';

export const useCompleteExercise = ({ closeModal }: { closeModal: () => void }) => {
  const [isPendingTransition, startTransition] = useTransition();

  const queryClient = useQueryClient();

  const { mutate: completeExercise, isPending } = useMutation({
    mutationKey: ['complete exercise'],
    mutationFn: () => ExercisesService.completeExercise(),
    onSuccess() {
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ['exercises'],
        });
        queryClient.invalidateQueries({
          queryKey: ['profile'],
        });
        closeModal();
      });
    },
    onError(error: any) {
      toast({
        message: error.message,
        type: 'danger',
      });
    },
  });

  const isPendingCompletion = isPendingTransition || isPending;

  return { isPendingCompletion, completeExercise };
};
