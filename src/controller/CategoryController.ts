// import FullList from "../model/FullList";
import Category from "../model/Category";
import Observer from "../types/Observer";
import Task from "../model/ListItem";

interface Controller {
  categories: Category[];
  load: () => void;
  save: () => void;
  addCategory: (category: Category) => void;
  findCategoryById: (id: string) => Category | undefined;
  findCategoryByName: (name: string) => Category | undefined;
  saveAndNotifyCategory: (UpdatedCategory: Category) => void;
  clearCategoryTasks: () => void;
  clearCompletedCategoryTasks: (e: Event) => void;
  syncWithTasks: (tasks: Task[]) => void;
}

export default class CategoryController implements Controller {
  static instance: CategoryController = new CategoryController();

  private categoryObservers: Observer<Category>[] = [];
  private _categories: Category[] = [];

  private constructor() {
    this.load();
    this.bindTaskEvents();
  }

  get categories(): Category[] {
    return this._categories;
  }

  load(): void {
    const stored: string | null = localStorage.getItem("categories");

    if (!stored) {
      console.warn("No categories found in localStorage");
      this._categories = [
        new Category("personal1000", "Personal", "var(--primary)"),
        new Category("business1000", "Business", "var(--variant)"),
      ];
      return;
    }

    const parsedCategories: {
      _id: string;
      _name: string;
      _color: string;
      _tasks: Array<string>;
      _completedTasks?: number;
    }[] = JSON.parse(stored);

    this._categories = parsedCategories.map(
      category =>
        new Category(
          category._id,
          category._name,
          category._color,
          category._tasks,
          category._completedTasks || 0
        )
    );
  }

  save(): void {
    localStorage.setItem("categories", JSON.stringify(this._categories));
  }

  syncWithTasks(tasks: Task[]): void {
    this._categories.forEach(category => {
      let completedCount = 0;

      category.tasks.forEach(taskId => {
        const task = tasks.find(item => item.id === taskId);
        if (task && task.checked) {
          completedCount++;
        }
      });

      category.completedTasks = completedCount;
    });

    this.save();
  }

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

  addCategory(category: Category): void {
    this._categories.push(category);
    this.save();
    this.notifyCategoryObservers(category);
  }

  findCategoryById(id: string): Category | undefined {
    return this._categories.find(category => category.id === id);
  }

  findCategoryByName(name: string): Category | undefined {
    return this._categories.find(category => category.name === name);
  }

  saveAndNotifyCategory(updatedCategory: Category): void {
    this._categories = this._categories.map(category =>
      category.id === updatedCategory.id ? updatedCategory : category
    );
    this.save();
    this.notifyCategoryObservers(updatedCategory);
  }

  addCategoryTask(e: Event): void {
    const customEvent = e as CustomEvent;
    const task = customEvent.detail;
    const category = this.findCategoryById(task.categoryId);

    if (category) {
      category.addTask(task.id);
      this.saveAndNotifyCategory(category);
    }
  }

  removeCategoryTask(e: Event): void {
    const customEvent = e as CustomEvent;
    const task = customEvent.detail;
    const category = this.findCategoryById(task.categoryId);

    if (category) {
      if (task.checked) {
        category.markTaskIncomplete(task.id);
      }
      category.removeTask(task.id);
      this.saveAndNotifyCategory(category);
    }
  }

  toggleCategoryTaskCompletion(e: Event): void {
    const customEvent = e as CustomEvent;
    const { task, wasChecked, isChecked } = customEvent.detail;
    const category = this.findCategoryById(task.categoryId);

    if (category) {
      if (isChecked && !wasChecked) {
        category.markTaskCompleted(task.id);
      } else if (!isChecked && wasChecked) {
        category.markTaskIncomplete(task.id);
      }

      this.saveAndNotifyCategory(category);
    }
  }

  clearCategoryTasks(): void {
    this._categories.forEach(category => {
      category.clearTasks();
      this.saveAndNotifyCategory(category);
    });
  }

  clearCompletedCategoryTasks(e: Event): void {
    const customEvent = e as CustomEvent;
    const removedItems = customEvent.detail;

    if (!removedItems) return;

    const affectedCategories = new Set<Category>();

    removedItems.forEach((task: { id: string; categoryId: string }) => {
      const category = this.findCategoryById(task.categoryId);
      if (category) {
        category.markTaskIncomplete(task.id);
        category.removeTask(task.id);
        affectedCategories.add(category);
      }
    });

    affectedCategories.forEach(category => {
      this.saveAndNotifyCategory(category);
    });
  }

  private bindTaskEvents(): void {
    window.addEventListener("taskAdded", (e: Event) => {
      this.addCategoryTask(e);
    });

    window.addEventListener("taskRemoved", (e: Event) => {
      this.removeCategoryTask(e);
    });

    window.addEventListener("taskToggled", (e: Event) => {
      this.toggleCategoryTaskCompletion(e);
    });

    window.addEventListener("tasksCleared", () => {
      this.clearCategoryTasks();
    });

    window.addEventListener("completedTasksCleared", (e: Event) => {
      this.clearCompletedCategoryTasks(e);
    });
  }
}
