import ApplicationController from "./ApplicationController";
import Category from "../model/Category";
import { Observer } from "../UI/category/types";
import Task from "../model/Task";

export default class CategoryController extends ApplicationController<Category> {
  private static _instance: CategoryController;

  private categoryObservers: Observer<Category>[] = [];

  private constructor() {
    super("todo-x-factr-categories");
    this.initializeDefaultCategory();
  }

  static get instance(): CategoryController {
    if (!CategoryController._instance) {
      CategoryController._instance = new CategoryController();
    }
    return CategoryController._instance;
  }

  get list(): Category[] {
    return this.items.filter(category => category.id !== "default");
  }

  // set categories(categories: Category[]) {
  //   this.setAll(categories);
  // }

  // ✅ Implement abstract methods
  protected getId(category: Category): string {
    return category.id;
  }

  protected deserializeItems(items: any[]): Category[] {
    return items.map(
      item =>
        new Category(
          item._id || item.id,
          item._name || item.name,
          item._color || item.color,
          item._tasks || item.tasks || [],
          item._completedTasks || item.completedTasks || 0
        )
    );
  }

  protected getControllerName(): string {
    return "category";
  }

  addTask(task: Task): void {
    if (!task || !task.id || !task.categoryId) return;

    const category = this.findById(task.categoryId);
    if (category) {
      category.addTask(task.id);
      this.saveToStorage();
      this.notifyCategoryObservers(category);
    }
  }

  updateTask(task: Task): void {
    if (!task) return;

    // Remove task from its current category
    const currentCategory = this.items.find(cat => cat.tasks.includes(task.id));
    if (currentCategory && currentCategory.id !== task.categoryId) {
      currentCategory.removeTask(task);
      if (task.checked) {
        // currentCategory.markTaskIncomplete(task.id);
      }
      this.update(currentCategory);
    }

    // Add task to the new category
    const newCategory = this.findById(task.categoryId);
    if (newCategory) {
      if (!newCategory.tasks.includes(task.id)) {
        newCategory.addTask(task.id);
        if (task.checked) {
          // newCategory.markTaskCompleted(task.id);
        }
      }
      this.update(newCategory);
    }
  }

  toggleTaskCheckStatus(taskId: string, completedCount: number): void {
    const category = this.getTaskCategory(taskId);

    if (category) {
      category.completedTasks = completedCount;
      // console.log("Completed tasks in category:", category.completedTasks);
      this.update(category);
      this.notifyCategoryObservers(category);
    }
  }

  removeTask(task: Task): void {
    if (!task || !task.id) return;

    const category = this.getTaskCategory(task.id);

    if (category) {
      category.removeTask(task);
      this.saveToStorage();
      this.notifyCategoryObservers(category);
    }
  }

  clearAllTasks(): void {
    this.list.forEach(category => {
      category.clearTasks();
      this.update(category);
      this.notifyCategoryObservers(category);
    });
  }

  clearCompletedTasks(completedTasks: Task[]): void {
    if (!completedTasks || completedTasks.length === 0) return;

    const affectedCategories = new Set<Category>();

    completedTasks.forEach((task: Task) => {
      const category = this.findById(task.categoryId);
      if (!category) return;

      category.removeTask(task);
      category.completedTasks = 0;
      affectedCategories.add(category);
    });

    affectedCategories.forEach(category => {
      this.update(category);
      this.notifyCategoryObservers(category);
    });
  }

  private initializeDefaultCategory(): void {
    if (this.items.length === 0) {
      const defaultCategory = new Category(
        "default",
        "Un-Categorized",
        "var(--text-300)",
        [],
        0
      );
      this.add(defaultCategory);
    }
  }

  isDefaultCategory(category: Category): boolean {
    return category.id === "default";
  }

  private getTaskCategory(taskId: string): Category | undefined {
    return this.items.find(cat => cat.tasks.includes(taskId));
  }

  // ✅ Override hooks for task-specific behavior
  protected beforeAdd(category: Category): void {
    // Validate category before adding
    if (!category.name?.trim()) {
      throw new Error("Category name cannot be empty");
    }

    // TODO: Validate length of name, there is a max-length on html validation
    //       When user reaches the max-length throw error
  }

  protected afterAdd(category: Category): void {
    // Perform any post-add actions
    console.log(`Category "${category.name}" added successfully`);
  }

  protected beforeUpdate(category: Category): void {
    // Validate category before updating
    if (!category.name?.trim()) {
      throw new Error("Category name cannot be empty");
    }
  }

  protected afterUpdate(category: Category): void {
    // Perform any post-update actions
    console.log(`Category "${category.name}" updated successfully`);
  }

  protected beforeRemove(category: Category): void {
    // Confirm deletion or log action
    console.log(`Removing category "${category.name}"...`);
  }

  protected afterRemove(category: Category): void {
    // Clean up any category-related data
    console.log(`Category "${category.name}" removed successfully`);
  }

  addCategoryObserver(observer: Observer<Category>): void {
    if (this.categoryObservers.includes(observer)) return;
    this.categoryObservers.push(observer);
  }

  removeCategoryObserver(observer: Observer<Category>): void {
    this.categoryObservers = this.categoryObservers.filter(
      obs => obs !== observer
    );
  }

  notifyCategoryObservers(category: Category): void {
    this.categoryObservers.forEach(observer => observer.update(category));
  }
}
