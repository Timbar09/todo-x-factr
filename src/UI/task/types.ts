// Task-related UI configuration
export interface TaskUIConfig {
  appElement: HTMLElement;
  taskListElement: HTMLUListElement;
}

export interface TaskMenuConfig {
  taskId: string;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export interface TaskFormData {
  title: string;
  categoryId: string;
}
