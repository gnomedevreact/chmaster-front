import { TaskType } from '@/src/shared/model/types/tasks.types';

export type ProfileType = {
  id: string;
  userId: string;
  name: string;
  chessRating: number;
  description: string;
  best_puzzle_rating: number;
  greatest_number_of_puzzles: number;
  difficulty_rating: number;
  solved_puzzles: number;
  avatar: string;
  created_at: string;
  current_day: number;
  tasks: TaskType[];
  world_place: number;
};
