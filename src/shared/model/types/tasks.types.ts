export type TaskType = {
  id: string;
  name: string;
  description: string;
  orderNum: number;
  createdAt: string;
  theme: string;
  opening: string;
};

export type GetAllTasks = {
  tasks: TaskType[];
  current_task: number;
};

export type TaskStatusType = 'completed' | 'in_progress' | 'locked';
