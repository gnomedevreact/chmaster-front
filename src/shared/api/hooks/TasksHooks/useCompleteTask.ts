import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TasksService } from '@/src/shared/api/services/tasks.service';
import { toast } from '@/src/shared/lib/utils/toast';
import { useTransition } from 'react';

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  const [isPendingTransition, startTransition] = useTransition();

  const { mutate: completeTask, isPending: isPendingCompleteTask } = useMutation({
    mutationKey: ['complete task'],
    mutationFn: (taskId: string) => TasksService.completeTask(taskId),
    onSuccess() {
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ['puzzles tasks'],
        });
        queryClient.invalidateQueries({
          queryKey: ['user tasks'],
        });
      });
    },
    onError(error: any) {
      console.error(error);
      toast({
        message: error.message,
        type: 'danger',
      });
    },
  });

  const isPendingCompletion = isPendingTransition || isPendingCompleteTask;

  return { completeTask, isPendingCompletion };
};
