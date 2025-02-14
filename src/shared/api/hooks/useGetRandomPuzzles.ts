import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PuzzlesService } from '@/src/shared/api/services/puzzles.service';
import { useEffect, useState } from 'react';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';
import { toast } from '@/src/shared/lib/utils/toast';

export const useGetRandomPuzzles = ({
  isTrainingStart,
  setPuzzlesCopy,
  resetGameStateLocal,
}: {
  isTrainingStart: boolean;
  setPuzzlesCopy: (e: (prevstate: any) => any) => void;
  resetGameStateLocal: () => void;
}) => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);

  const queryClient = useQueryClient();

  const {
    data: fetchedPuzzles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['puzzles'],
    queryFn: () => PuzzlesService.getRandomPuzzles({ limit: puzzles.length > 0 ? 5 : 5 }),
    select: ({ data }) => data,
    enabled: isTrainingStart,
  });

  const resetPuzzles = () => {
    queryClient.removeQueries({ queryKey: ['puzzles'] });
    setPuzzles([]);
  };

  useEffect(() => {
    if (isTrainingStart && fetchedPuzzles!.length <= 0) {
      toast({
        message: 'No such puzzles (try to change min/max rating)',
        type: 'danger',
      });
      resetGameStateLocal();
      resetPuzzles();

      return;
    }

    if (fetchedPuzzles) {
      setPuzzles((prevState) => [...prevState, ...fetchedPuzzles]);
      setPuzzlesCopy((prevState) => [...prevState, ...fetchedPuzzles]);
    }
  }, [fetchedPuzzles]);

  useEffect(() => {
    if (error) {
      resetGameStateLocal();
      resetPuzzles();
      toast({
        message: 'Something went wrong, reload the app',
        type: 'danger',
      });
    }
  }, [error]);

  return { puzzles, resetPuzzles, isLoading };
};
