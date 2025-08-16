import FullList from "../model/FullList";
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
  updateCategory: (UpdatedCategory: Category) => void;
  clearCategoryTasks: () => void;
  clearCompletedCategoryTasks: (fullList: FullList) => void;
  syncWithTasks: (tasks: Task[]) => void;
}

export default class CategoryController implements Controller {
  static instance: CategoryController = new CategoryController();

  private categoryObservers: Observer<Category>[] = [];
  private _categories: Category[] = [];

  private constructor() {
    // ] //   new Category("business1000", "Business", "var(--variant)"), //   new Category("personal1000", "Personal", "var(--primary)"), // private _categories: Category[] = [
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
    tasks.forEach(task => {
      const category = this.findCategoryById(task.categoryId);

      if (category && !category.tasks.includes(task.id)) {
        category.addTask(task.id);
      }
    });

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

  updateCategory(updatedCategory: Category): void {
    this._categories = this._categories.map(category =>
      category.id === updatedCategory.id ? updatedCategory : category
    );
    this.save();
    this.notifyCategoryObservers(updatedCategory);
  }

  clearCategoryTasks(): void {
    this._categories.forEach(category => {
      category.clearTasks();
      this.updateCategory(category);
    });
  }

  clearCompletedCategoryTasks(fullList: FullList) {
    this.categories.forEach(category => {
      fullList.list.forEach(item => {
        if (item.checked) {
          category.removeTask(item.id);
        }
      });
      this.updateCategory(category);
    });
  }

  private bindTaskEvents(): void {
    window.addEventListener("taskAdded", (e: Event) => {
      const customEvent = e as CustomEvent;
      const task = customEvent.detail.item;
      const category = this.findCategoryById(task.categoryId);

      if (category) {
        category.addTask(task.id);
        this.save();
      }
    });

    window.addEventListener("taskRemoved", (e: Event) => {
      const customEvent = e as CustomEvent;
      const task = customEvent.detail.removedItem;
      const category = this.findCategoryById(task.categoryId);

      if (category) {
        if (task.checked) {
          category.markTaskIncomplete(task.id);
        }
        category.removeTask(task.id);
        this.save();
      }
    });

    window.addEventListener("taskToggled", (e: Event) => {
      const customEvent = e as CustomEvent;
      const { task, wasChecked, isChecked } = customEvent.detail;
      const category = this.findCategoryById(task.categoryId);

      if (category) {
        if (isChecked && !wasChecked) {
          category.markTaskCompleted(task.id);
        } else if (!isChecked && wasChecked) {
          category.markTaskIncomplete(task.id);
        }

        this.save();
      }
    });

    window.addEventListener("completedTasksCleared", (e: Event) => {
      const customEvent = e as CustomEvent;
      const { removedItems } = customEvent.detail;

      removedItems.forEach((task: { id: string; categoryId: string }) => {
        const category = this.findCategoryById(task.categoryId);
        if (category) {
          category.markTaskIncomplete(task.id);
          category.removeTask(task.id);
        }
      });
      this.save();
    });
  }
}
