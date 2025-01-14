import { useQuery } from '@tanstack/react-query';
import { PuzzlesService } from '@/src/shared/api/services/puzzles.service';

export const useGetRandomPuzzles = () => {
  const { data: puzzles } = useQuery({
    queryKey: ['puzzles'],
    queryFn: () => PuzzlesService.getRandomPuzzles(),
    select: ({ data }) => data,
  });

  return { puzzles };
};
