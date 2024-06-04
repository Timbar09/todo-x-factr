import CategoryItem from "./CategoryItem";

interface List {
  categories: CategoryItem[];
  load: () => void;
  save: () => void;
  addCategory: (category: CategoryItem) => void;
  findCategoryById: (id: string) => CategoryItem | undefined;
  findCategoryByName: (name: string) => CategoryItem | undefined;
  updateCategory: (UpdatedCategory: CategoryItem) => void;
}

export interface Observer {
  update: (category: CategoryItem) => void;
}

export default class CategoryList implements List {
  static instance: CategoryList = new CategoryList();

  private observers: Observer[] = [];

  private constructor(
    private _categories: CategoryItem[] = [
      new CategoryItem("personal1000", "Personal", "var(--primary)"),
      new CategoryItem("business1000", "Business", "var(--variant)"),
    ]
  ) {}

  get categories(): CategoryItem[] {
    return this._categories;
  }

  load(): void {
    const storedCategories: string | null = localStorage.getItem("categories");

    if (typeof storedCategories !== "string") return;

    const parsedCategories: {
      _id: string;
      _name: string;
      _color: string;
      _items: Array<string>;
    }[] = JSON.parse(storedCategories);

    this._categories = parsedCategories.map(
      (category) =>
        new CategoryItem(
          category._id,
          category._name,
          category._color,
          category._items
        )
    );
  }

  save(): void {
    localStorage.setItem("categories", JSON.stringify(this._categories));
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers(category: CategoryItem): void {
    this.observers.forEach((observer) => observer.update(category));
  }

  addCategory(category: CategoryItem): void {
    this._categories.push(category);
    this.save();
    this.notifyObservers(category);
  }

  findCategoryById(id: string): CategoryItem | undefined {
    this.load();
    return this._categories.find((category) => category.id === id);
  }

  findCategoryByName(name: string): CategoryItem | undefined {
    this.load();
    return this._categories.find((category) => category.name === name);
  }

  updateCategory(updatedCategory: CategoryItem): void {
    this._categories = this._categories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    );
    this.save();
    this.notifyObservers(updatedCategory);
  }
}
