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
    return this.items;
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

  remove(id: string): void {
    console.log(
      `Overriding default remove behavior from parent class to remove categoryId: ${id}`
    );
    // const category = this.findById(id);
    // if (category && !this.isDefaultCategory(category)) {
    //   this.remove(id);
    // }
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
    });
  }

  clearCompletedTasks(completedTasks: Task[]): void {
    if (!completedTasks) return;

    // const affectedCategories = new Set<Category>();

    completedTasks.forEach((task: Task) => {
      const category = this.findById(task.categoryId);
      if (category) {
        category.removeTask(task);
        category.completedTasks = 0;
        this.saveToStorage();
      }
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

  // load(): void {
  //   const stored: string | null = localStorage.getItem("categories");

  //   if (!stored) {
  //     this._categories = [
  //       new Category("personal1000", "Personal", "var(--primary)"),
  //       new Category("business1000", "Business", "var(--variant)"),
  //     ];
  //     return;
  //   }

  //   const parsedCategories: {
  //     _id: string;
  //     _name: string;
  //     _color: string;
  //     _tasks: Array<string>;
  //     _completedTasks?: number;
  //   }[] = JSON.parse(stored);

  //   this._categories = parsedCategories.map(
  //     category =>
  //       new Category(
  //         category._id,
  //         category._name,
  //         category._color,
  //         category._tasks,
  //         category._completedTasks || 0
  //       )
  //   );
  // }

  // save(): void {
  //   localStorage.setItem("categories", JSON.stringify(this._categories));
  // }

  // syncWithTasks(tasks: Task[]): void {
  //   this._categories.forEach(category => {
  //     let completedCount = 0;

  //     category.tasks.forEach(taskId => {
  //       const task = tasks.find(item => item.id === taskId);
  //       if (task && task.checked) {
  //         completedCount++;
  //       }
  //     });

  //     category.completedTasks = completedCount;
  //   });

  //   this.save();
  // }

  // Category Observers

  addCategoryObserver(observer: Observer<Category>): void {
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

  // addCategory(category: Category): void {
  //   this._categories.push(category);
  //   this.save();
  //   this.notifyCategoryObservers(category);
  // }

  // findCategoryById(id: string): Category | undefined {
  //   return this._categories.find(category => category.id === id);
  // }

  // findCategoryByName(name: string): Category | undefined {
  //   return this._categories.find(category => category.name === name);
  // }

  // private saveAndNotifyCategory(updatedCategory: Category): void {
  //   this._categories = this._categories.map(category =>
  //     category.id === updatedCategory.id ? updatedCategory : category
  //   );
  //   this.save();
  //   this.notifyCategoryObservers(updatedCategory);
  // }

  // private addCategoryTask(e: Event): void {
  //   const customEvent = e as CustomEvent;
  //   const task = customEvent.detail;
  //   const category = this.findCategoryById(task.categoryId);

  //   if (category) {
  //     category.addTask(task.id);
  //     this.saveAndNotifyCategory(category);
  //   }
  // }

  // private removeCategoryTask(e: Event): void {
  //   const customEvent = e as CustomEvent;
  //   const task = customEvent.detail;
  //   const category = this.findCategoryById(task.categoryId);

  //   if (category) {
  //     if (task.checked) {
  //       category.markTaskIncomplete(task.id);
  //     }
  //     category.removeTask(task.id);
  //     this.saveAndNotifyCategory(category);
  //   }
  // }

  // private toggleCategoryTaskCompletion(e: Event): void {
  //   const customEvent = e as CustomEvent;
  //   const { task, wasChecked, isChecked } = customEvent.detail;
  //   const category = this.findCategoryById(task.categoryId);

  //   if (category) {
  //     if (isChecked && !wasChecked) {
  //       category.markTaskCompleted(task.id);
  //     } else if (!isChecked && wasChecked) {
  //       category.markTaskIncomplete(task.id);
  //     }

  //     this.saveAndNotifyCategory(category);
  //   }
  // }

  // private clearCategoryTasks(): void {
  //   this._categories.forEach(category => {
  //     category.clearTasks();
  //     this.saveAndNotifyCategory(category);
  //   });
  // }

  // private clearCompletedCategoryTasks(e: Event): void {
  //   const customEvent = e as CustomEvent;
  //   const removedItems = customEvent.detail;

  //   if (!removedItems) return;

  //   const affectedCategories = new Set<Category>();

  //   removedItems.forEach((task: { id: string; categoryId: string }) => {
  //     const category = this.findCategoryById(task.categoryId);
  //     if (category) {
  //       category.markTaskIncomplete(task.id);
  //       category.removeTask(task.id);
  //       affectedCategories.add(category);
  //     }
  //   });

  //   affectedCategories.forEach(category => {
  //     this.saveAndNotifyCategory(category);
  //   });
  // }

  // private bindTaskEvents(): void {
  //   window.addEventListener("taskAdded", (e: Event) => {
  //     this.addCategoryTask(e);
  //   });

  //   window.addEventListener("taskRemoved", (e: Event) => {
  //     this.removeCategoryTask(e);
  //   });

  //   window.addEventListener("taskToggled", (e: Event) => {
  //     this.toggleCategoryTaskCompletion(e);
  //   });

  //   window.addEventListener("tasksCleared", () => {
  //     this.clearCategoryTasks();
  //   });

  //   window.addEventListener("completedTasksCleared", (e: Event) => {
  //     this.clearCompletedCategoryTasks(e);
  //   });
  // }
}
