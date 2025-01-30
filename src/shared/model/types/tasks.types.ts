export type TaskType = {
  id: string;
  userId: string;
  name: string;
  description: string;
  orderNum: number;
  status: 'completed' | 'in_progress' | 'locked';
  createdAt: string;
  theme: string;
  opening: string;
};

export type UserTaskType = {
  id: string;
  status: 'completed' | 'in_progress' | 'locked';
  orderNum: number;
};
