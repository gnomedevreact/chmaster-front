import { axiosAuth } from '@/src/core/lib/axios/config';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';
import { storage } from '@/src/core/lib/store/storage';

export const PuzzlesService = {
  async getRandomPuzzles({ limit }: { limit: number }) {
    return await axiosAuth.get<Puzzle[]>('/puzzles', {
      params: {
        minRating: storage.getString('minRating') || 200,
        maxRating: storage.getString('maxRating') || 800,
        limit,
      },
    });
  },
};
