import Task from "./Task";

export interface CategoryInterface {
  id: string;
  name: string;
  color: string;
  tasks: string[];
  completedTasks: number;
  completionPercentage: number;
  isAccordionOpen?: boolean;
  addTask: (taskId: string) => void;
  removeTask: (task: Task) => void;
  clearTasks: () => void;
}

export default class Category implements CategoryInterface {
  constructor(
    private _id: string,
    private _name: string,
    private _color: string,
    private _tasks: string[] = [],
    private _completedTasks: number,
    private _isAccordionOpen: boolean = false
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

  get isAccordionOpen(): boolean {
    return this._isAccordionOpen;
  }

  set isAccordionOpen(value: boolean) {
    this._isAccordionOpen = value;
  }

  addTask(taskId: string): void {
    if (this._tasks.includes(taskId)) return;
    this._tasks.push(taskId);
  }

  removeTask(task: Task): void {
    this._tasks = this._tasks.filter(id => id !== task.id);
    this.completedTasks = Math.min(this.completedTasks, this._tasks.length);
  }

  clearTasks(): void {
    this._tasks = [];
    this.completedTasks = 0;
  }
}
