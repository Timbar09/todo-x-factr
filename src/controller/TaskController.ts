import Task from "../model/Task";

const STORAGE_KEY = "todo-tasks";
interface Controller {
  tasks: Task[];
  load: () => void;
  save: () => void;
  clearTasks: () => void;
  clearCompleted: () => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  toggleCheckStatus: (taskId: string) => void;
}

export default class TaskController implements Controller {
  static instance: TaskController = new TaskController();

  private _tasks: Task[] = [];

  private constructor() {
    this.load();
  }

  get tasks(): Task[] {
    return this._tasks;
  }

  load(): void {
    const storedList: string | null = localStorage.getItem(STORAGE_KEY);

    if (typeof storedList !== "string") return;

    const parsedList: {
      _id: string;
      _title: string;
      _checked: boolean;
      _categoryId: string;
    }[] = JSON.parse(storedList);

    this._tasks = parsedList.map(
      task => new Task(task._id, task._title, task._checked, task._categoryId)
    );
  }

  save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._tasks));
  }

  clearTasks(): void {
    this._tasks = [];
    this.save();

    window.dispatchEvent(new CustomEvent("tasksCleared"));
  }

  clearCompleted(): void {
    const removedTasks = this._tasks.filter(task => task.checked);
    this._tasks = this._tasks.filter(task => !task.checked);
    this.save();

    window.dispatchEvent(
      new CustomEvent("completedTasksCleared", { detail: removedTasks })
    );
  }

  addTask(task: Task): void {
    this._tasks.unshift(task);
    this.save();

    window.dispatchEvent(new CustomEvent("taskAdded", { detail: task }));
  }

  removeTask(taskId: string): void {
    const removedTask = this._tasks.find(task => task.id === taskId);
    this._tasks = this._tasks.filter(task => task.id !== taskId);
    this.save();

    if (removedTask) {
      window.dispatchEvent(
        new CustomEvent("taskRemoved", { detail: removedTask })
      );
    }
  }

  toggleCheckStatus(taskId: string): void {
    const task = this._tasks.find(task => task.id === taskId);

    if (task) {
      const wasChecked = task.checked;
      task.checked = !wasChecked;
      this.save();

      window.dispatchEvent(
        new CustomEvent("taskToggled", {
          detail: {
            task,
            wasChecked,
            isChecked: task.checked,
          },
        })
      );
    }
  }
}
