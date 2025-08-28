import TaskController from "./TaskController";
import CategoryController from "./CategoryController";
import TemplateController from "./TemplateController";
import Task from "../model/Task";
import Category from "../model/Category";

export default class CentralController {
  private static _instance: CentralController;

  private taskController: TaskController;
  private categoryController: CategoryController;
  private templateController: TemplateController;

  private constructor() {
    this.taskController = TaskController.instance;
    this.categoryController = CategoryController.instance;
    this.templateController = TemplateController.instance;

    this.bindCrossControllerLogic();
  }

  static get instance(): CentralController {
    if (!CentralController._instance) {
      CentralController._instance = new CentralController();
    }
    return CentralController._instance;
  }

  // Expose controllers for UI access
  get task() {
    return this.taskController;
  }

  get category() {
    return this.categoryController;
  }

  get template() {
    return this.templateController;
  }

  // Cross-controller business logic
  private bindCrossControllerLogic(): void {
    window.addEventListener("categoryRemoved", (e: Event) => {
      const customEvent = e as CustomEvent;
      const category = customEvent.detail.data;
      this.reassignTasksFromDeletedCategory(category.id);
    });
  }

  // High-level operations that coordinate multiple controllers
  addTask(task: Task): void {
    this.taskController.add(task);
    this.categoryController.addTask(task);
  }

  updateTask(task: Task): void {
    this.taskController.update(task);
    this.categoryController.updateTask(task);
  }

  toggleTaskCheckStatus(id: string): void {
    const task = this.taskController.findById(id);

    if (task) {
      this.taskController.toggleCheckStatus(id);

      const completedCount = this.taskController.getCompletedTasks().length;
      this.categoryController.toggleTaskCheckStatus(id, completedCount);
    }
  }

  deleteTask(taskId: string): void {
    const task = this.taskController.findById(taskId);
    if (!task) return;

    this.taskController.deleteTask(taskId);

    const completedCount = this.taskController.getCompletedTasks().length;
    const category = this.categoryController.findById(task.categoryId);

    if (category) {
      category.completedTasks = completedCount;
      this.categoryController.update(category);
    }

    this.categoryController.removeTask(task);
  }

  clearAllTasks(): void {
    this.taskController.clear();
    this.categoryController.clearAllTasks();
  }

  clearCompletedTasks(): void {
    const completedTasks = this.taskController.getCompletedTasks();

    this.taskController.clearCompleted();
    this.categoryController.clearCompletedTasks(completedTasks);
  }

  // Methods for upcoming features
  createTaskInCategory(title: string, categoryId: string): void {
    const category = this.categoryController.findById(categoryId);
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }

    const task = new Task(crypto.randomUUID(), title, false, categoryId);
    this.taskController.add(task);
  }

  createTaskWithNewCategory(
    title: string,
    categoryName: string,
    categoryColor: string = ""
  ): void {
    // If category color is an empty string, generate a random color
    if (!categoryColor) {
      categoryColor = this.generateRandomColor();
    }

    // Create category first
    const category = new Category(
      crypto.randomUUID(),
      categoryName,
      categoryColor,
      [],
      0
    );
    this.categoryController.add(category);

    // Then create task in that category
    this.createTaskInCategory(title, category.id);
  }

  moveTaskToCategory(taskId: string, newCategoryId: string): void {
    const task = this.taskController.findById(taskId);
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    const newCategory = this.categoryController.findById(newCategoryId);
    if (!newCategory) {
      throw new Error(`Category with id ${newCategoryId} not found`);
    }

    const oldCategoryId = task.categoryId;

    // Update task
    task.categoryId = newCategoryId;
    this.taskController.update(task);

    // Update categories
    this.removeTaskFromCategoryById(taskId, oldCategoryId);
    this.addTaskToCategoryById(taskId, newCategoryId);
  }

  deleteCategory(categoryId: string): void {
    if (categoryId === "default") {
      throw new Error("Cannot delete default category");
    }

    // Move all tasks to default category
    this.reassignTasksFromDeletedCategory(categoryId);

    // Remove the category
    this.categoryController.remove(categoryId);
  }

  private reassignTasksFromDeletedCategory(deletedCategoryId: string): void {
    const tasksToReassign = this.taskController.list.filter(
      task => task.categoryId === deletedCategoryId
    );

    tasksToReassign.forEach(task => {
      task.categoryId = "default";
      this.taskController.update(task);
    });

    // Add tasks to default category
    const defaultCategory = this.categoryController.findById("default");
    if (defaultCategory) {
      tasksToReassign.forEach(task => {
        if (!defaultCategory.tasks.includes(task.id)) {
          defaultCategory.tasks.push(task.id);
        }
      });
      this.categoryController.update(defaultCategory);
    }
  }

  private addTaskToCategoryById(taskId: string, categoryId: string): void {
    const category = this.categoryController.findById(categoryId);
    if (category && !category.tasks.includes(taskId)) {
      category.tasks.push(taskId);
      this.categoryController.update(category);
    }
  }

  private removeTaskFromCategoryById(taskId: string, categoryId: string): void {
    if (categoryId === "default") return; // Do not remove from default category

    const task = this.taskController.findById(taskId);
    const category = this.categoryController.findById(categoryId);
    if (category && task) {
      category.removeTask(task);
      this.categoryController.update(category);
    }
  }

  private generateRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
