import { axiosAuth } from '@/src/core/lib/axios/config';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';

export const PuzzlesService = {
  async getRandomPuzzles() {
    return await axiosAuth.get<Puzzle[]>('/puzzles', {
      params: {
        maxRating: 2000,
        minRating: 200,
        limit: 10,
      },
    });
  },
};
