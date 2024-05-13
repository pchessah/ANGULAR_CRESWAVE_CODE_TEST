export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export enum TaskStatus {
  'COMPLETED' = 'Completed',
  'INCOMPLETE' = 'Incomplete'
}

