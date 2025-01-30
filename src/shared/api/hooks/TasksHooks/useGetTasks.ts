import { useQuery } from '@tanstack/react-query';
import { TasksService } from '@/src/shared/api/services/tasks.service';

export const useGetTasks = () => {
  const {
    data: userTasks,
    isLoading: isLoadingUserTasks,
    error,
  } = useQuery({
    queryKey: ['user tasks'],
    queryFn: () => TasksService.getUserTasks(),
    select: ({ data }) => data.tasks,
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => TasksService.getAllTasks(),
    select: ({ data }) => data,
  });

  return { userTasks, tasks, isLoadingTasks, isLoadingUserTasks, error };
};
