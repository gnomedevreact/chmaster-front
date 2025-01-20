import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PuzzlesService } from '@/src/shared/api/services/puzzles.service';
import { useEffect, useState } from 'react';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';

export const useGetRandomPuzzles = ({
  isTrainingStart,
}: {
  isTrainingStart: boolean;
}) => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);

  const queryClient = useQueryClient();

  const { data: fetchedPuzzles, isLoading } = useQuery({
    queryKey: ['puzzles'],
    queryFn: () => PuzzlesService.getRandomPuzzles({ limit: puzzles.length > 0 ? 2 : 2 }),
    select: ({ data }) => data,
    enabled: isTrainingStart,
  });

  const resetPuzzles = () => {
    queryClient.removeQueries({ queryKey: ['puzzles'] });
    setPuzzles([]);
  };

  useEffect(() => {
    if (fetchedPuzzles) {
      setPuzzles((prevState) => [...prevState, ...fetchedPuzzles]);
    }
  }, [fetchedPuzzles]);

  return { puzzles, resetPuzzles, isLoading };
};
