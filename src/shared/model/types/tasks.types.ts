export type TaskType = {
  id: string;
  name: string;
  description: string;
  orderNum: number;
  createdAt: string;
  theme: string;
  opening: string;
};

export type UserTaskType = {
  id: string;
  status: TaskStatusType;
  orderNum: number;
};

export type TaskStatusType = 'completed' | 'in_progress' | 'locked';
