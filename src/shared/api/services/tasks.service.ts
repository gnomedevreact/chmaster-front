import { axiosAuth } from '@/src/core/lib/axios/config';
import { GetAllTasks } from '@/src/shared/model/types/tasks.types';

export const TasksService = {
  async getAllTasks() {
    return await axiosAuth.get<GetAllTasks>('/puzzles/tasks');
  },

  async completeTask() {
    return await axiosAuth.post(`/puzzles/complete`);
  },
};
