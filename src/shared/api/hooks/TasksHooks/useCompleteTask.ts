import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TasksService } from '@/src/shared/api/services/tasks.service';
import { toast } from '@/src/shared/lib/utils/toast';
import { useState, useTransition } from 'react';

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  const [isPendingTransition, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState(false);

  const { mutate: completeTask, isPending: isPendingCompleteTask } = useMutation({
    mutationKey: ['complete task'],
    mutationFn: (taskId: string) => TasksService.completeTask(taskId),
    onSuccess() {
      setIsComplete(true);
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ['puzzles tasks'],
        });
        queryClient.invalidateQueries({
          queryKey: ['user tasks'],
        });
        queryClient.invalidateQueries({
          queryKey: ['profile'],
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

  return { completeTask, isPendingCompletion, isComplete };
};
