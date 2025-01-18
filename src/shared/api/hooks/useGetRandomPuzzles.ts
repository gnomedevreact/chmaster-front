import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PuzzlesService } from '@/src/shared/api/services/puzzles.service';
import { useEffect, useState } from 'react';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';

export const useGetRandomPuzzles = ({
  isTrainingStart,
}: {
  isTrainingStart: boolean;
}) => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>();

  const queryClient = useQueryClient();

  const { data: fetchedPuzzles } = useQuery({
    queryKey: ['puzzles'],
    queryFn: () => PuzzlesService.getRandomPuzzles(),
    select: ({ data }) => data,
    enabled: isTrainingStart,
  });

  const resetPuzzles = () => {
    queryClient.removeQueries({ queryKey: ['puzzles'] });
  };

  useEffect(() => {
    if (fetchedPuzzles) {
      setPuzzles({ ...puzzles, ...fetchedPuzzles });
    }
  }, [fetchedPuzzles]);

  return { puzzles, resetPuzzles };
};
