import { axiosAuth } from '@/src/core/lib/axios/config';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PuzzlesService = {
  async getRandomPuzzles() {
    return await axiosAuth.get<Puzzle[]>('/puzzles', {
      params: {
        minRating: (await AsyncStorage.getItem('minRating')) || 200,
        maxRating: (await AsyncStorage.getItem('maxRating')) || 600,
        limit: 10,
      },
    });
  },
};
