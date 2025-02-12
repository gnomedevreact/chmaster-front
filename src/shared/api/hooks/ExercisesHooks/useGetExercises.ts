import { useQuery } from '@tanstack/react-query';
import { ExercisesService } from '@/src/shared/api/services/exercises.service';

export const useGetExercises = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => ExercisesService.getExercises(),
    select: ({ data }) => data,
    staleTime: 1000 * 60 * 5,
  });

  return { data, isLoading };
};
