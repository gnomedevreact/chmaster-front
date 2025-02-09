import { useQuery } from '@tanstack/react-query';
import { TasksService } from '@/src/shared/api/services/tasks.service';

export const useGetTasks = () => {
  const { data: allTasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => TasksService.getAllTasks(),
    select: ({ data }) => data,
  });

  return { allTasks, isLoadingTasks };
};
