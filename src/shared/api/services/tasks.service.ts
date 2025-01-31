import { axiosAuth } from '@/src/core/lib/axios/config';
import { TaskType, UserTaskType } from '@/src/shared/model/types/tasks.types';

export const TasksService = {
  async getUserTasks() {
    return await axiosAuth.get<{ tasks: UserTaskType[] }>('/puzzles/profile-tasks');
  },

  async getAllTasks() {
    return await axiosAuth.get<TaskType[]>('/puzzles/tasks');
  },

  async completeTask(taskId: string) {
    return await axiosAuth.post(`/puzzles/complete/${taskId}`);
  },
};
