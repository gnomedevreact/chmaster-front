import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PuzzlesService } from '@/src/shared/api/services/puzzles.service';
import { useEffect, useState } from 'react';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';
import { toast } from '@/src/shared/lib/utils/toast';
import { TaskType } from '@/src/shared/model/types/tasks.types';
import { storage } from '@/src/core/lib/store/storage';

export const useGetPuzzlesByTheme = ({
  isTrainingStart,
  resetGameStateLocal,
  task,
}: {
  isTrainingStart: boolean;
  resetGameStateLocal: () => void;
  task: TaskType;
}) => {
  const savedPuzzles = storage.getString('puzzles');
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);

  const queryClient = useQueryClient();

  const {
    data: fetchedPuzzles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['puzzles tasks', task.id],
    queryFn: () =>
      PuzzlesService.getPuzzlesBySearchTerm({ opening: task.opening, theme: task.theme }),
    select: ({ data }) => data,
    enabled: isTrainingStart && !savedPuzzles,
  });

  const resetPuzzles = () => {
    queryClient.removeQueries({ queryKey: ['puzzles tasks', task.id] });
    setPuzzles([]);
  };

  useEffect(() => {
    if (fetchedPuzzles) {
      storage.set('puzzles', JSON.stringify(fetchedPuzzles));
      setPuzzles(fetchedPuzzles);
    }
  }, [fetchedPuzzles]);

  useEffect(() => {
    if (savedPuzzles) {
      const parsedPuzzles = JSON.parse(savedPuzzles);

      if (parsedPuzzles.length > 0) {
        setPuzzles(parsedPuzzles);
      }
    }
  }, []);

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
