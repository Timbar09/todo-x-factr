import ApplicationController from "./ApplicationController";
import Task from "../model/Task";

export default class TaskController extends ApplicationController<Task> {
  private static _instance: TaskController;

  private constructor() {
    super("todo-x-factr-tasks");
  }

  static get instance(): TaskController {
    if (!TaskController._instance) {
      TaskController._instance = new TaskController();
    }
    return TaskController._instance;
  }

  get list(): Task[] {
    return this.items;
  }

  set list(tasks: Task[]) {
    this.items = tasks;
  }

  toggleCheckStatus(id: string): void {
    const task = this.findById(id);
    if (task) {
      task.checked = !task.checked;
      this.update(task);
    }
  }

  deleteTask(id: string): void {
    const task = this.findById(id);
    if (task) {
      this.remove(task.id);
    }
  }

  clearCompleted(): void {
    this.list = this.list.filter(task => !task.checked);
  }

  getTasksByCategory(categoryId: string): Task[] {
    return this.items.filter(task => task.categoryId === categoryId);
  }

  getCompletedTasks(): Task[] {
    return this.items.filter(task => task.checked);
  }

  getPendingTasks(): Task[] {
    return this.items.filter(task => !task.checked);
  }

  // Abstract methods
  protected getId(task: Task): string {
    return task.id;
  }

  protected deserializeItems(items: any[]): Task[] {
    return items.map(
      item =>
        new Task(
          item._id || item.id,
          item._title || item.title,
          item._checked || item.checked,
          item._categoryId || item.categoryId
        )
    );
  }

  protected getControllerName(): string {
    return "task";
  }

  // ✅ Override hooks for task-specific behavior
  protected beforeAdd(task: Task): void {
    // Validate task before adding
    if (!task.title?.trim()) {
      throw new Error("Task title cannot be empty");
    }

    // TODO: Valiated length of tittle, there is a max lenght on html validation
    //       When user reaches the max-length throe error
  }

  protected afterAdd(task: Task): void {
    // Perform any post-add actions
    console.log(`Task "${task.title}" added successfully`);
  }

  protected beforeUpdate(item: Task): void {
    // Validate task before updating
    if (!item.title?.trim()) {
      throw new Error("Task title cannot be empty");
    }
  }

  protected afterUpdate(item: Task): void {
    // Perform any post-update actions
    console.log(`Task "${item.title}" updated successfully`);
  }

  protected beforeRemove(item: Task): void {
    // Confirm deletion or log action
    console.log(`Removing task "${item.title}"...`);
  }

  protected afterRemove(task: Task): void {
    // Clean up any task-related data
    console.log(`Task "${task.title}" removed successfully`);
  }
}
