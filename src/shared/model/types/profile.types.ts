import { TaskType } from '@/src/shared/model/types/tasks.types';

export type ProfileType = {
  id: string;
  user_id: string;
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
  current_task: number;
  current_phase: number;
  current_exercise: number;
  exercise_done: boolean;
};

export type UpdateProfileType = {
  exp?: number;
  puzzles?: number;
  tasks?: number;
  streak_completed?: boolean;
  streak?: number;
};

export type UpdateProfileInfoType = {
  name?: string;
  chessRating?: number;
};
