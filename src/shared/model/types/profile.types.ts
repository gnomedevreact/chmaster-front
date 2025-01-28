import { TaskType } from '@/src/shared/model/types/tasks.types';

export type ProfileType = {
  id: string;
  userId: string;
  name: string;
  chessRating: number;
  solved_puzzles: number;
  avatar: string;
  created_at: string;
  tasks: TaskType[];
  world_place: number;
  solved_tasks: number;
  streak_satisfied: boolean;
  streak: number;
  exp: number;
};

export type UpdateProfileType = {
  exp?: number;
  puzzles?: number;
  tasks?: number;
  streak_completed?: boolean;
  streak?: number;
};
