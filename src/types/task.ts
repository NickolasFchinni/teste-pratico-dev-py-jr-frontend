export interface User {
  id: number;
  username: string;
}

export interface Task {
  id: number;
  user: User;
  title: string;
  description: string;
  complete: boolean;
  create: string;
}

export interface PaginatedTasks {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}