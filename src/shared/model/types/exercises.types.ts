export type ExerciseType = {
  id: string;
  created_at: string;
  title: string;
  description: string;
};

export type GetExercisesType = {
  exercises: ExerciseType[];
  current_exercise: number;
  current_phase: number;
  exercise_done: boolean;
};
