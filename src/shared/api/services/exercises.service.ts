import { axiosAuth } from '@/src/core/lib/axios/config';
import { GetExercisesType } from '@/src/shared/model/types/exercises.types';

export const ExercisesService = {
  async getExercises() {
    return await axiosAuth.get<GetExercisesType>('/exercises');
  },

  async completeExercise() {
    return await axiosAuth.patch(`/exercises/complete`);
  },
};
