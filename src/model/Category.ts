export interface CategoryInterface {
  id: string;
  name: string;
  color: string;
  tasks: string[];
  completedTasks: number;
  completionPercentage: number;
  addTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  clearTasks: () => void;
  markTaskCompleted: (taskId: string) => void;
  markTaskIncomplete: (taskId: string) => void;
}

export default class Category implements CategoryInterface {
  constructor(
    private _id: string,
    private _name: string,
    private _color: string,
    private _tasks: string[] = [],
    private _completedTasks: number = 0
  ) {}

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get color(): string {
    return this._color;
  }

  set color(color: string) {
    this._color = color;
  }

  get tasks(): string[] {
    return this._tasks;
  }

  get completedTasks(): number {
    return this._completedTasks;
  }

  set completedTasks(count: number) {
    this._completedTasks = Math.max(0, Math.min(count, this._tasks.length));
  }

  get completionPercentage(): number {
    return this._tasks.length > 0
      ? Math.round((this._completedTasks / this._tasks.length) * 100)
      : 0;
  }

  addTask(taskId: string): void {
    if (this._tasks.includes(taskId)) return;
    this._tasks.push(taskId);
  }

  removeTask(taskId: string): void {
    this._tasks = this._tasks.filter(id => id !== taskId);
    this.completedTasks = Math.min(this.completedTasks, this._tasks.length);
  }

  clearTasks(): void {
    this._tasks = [];
    this.completedTasks = 0;
  }

  markTaskCompleted(taskId: string): void {
    if (this._tasks.includes(taskId)) {
      this.completedTasks = Math.min(
        this.completedTasks + 1,
        this._tasks.length
      );
    }
  }

  markTaskIncomplete(taskId: string): void {
    if (this._tasks.includes(taskId)) {
      this.completedTasks = Math.max(this.completedTasks - 1, 0);
    }
  }
}
