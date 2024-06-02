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

export default class CategoryList implements List {
  static instance: CategoryList = new CategoryList();

  private constructor(
    private _categories: CategoryItem[] = [
      new CategoryItem(crypto.randomUUID(), "Personal", "var(--primary)"),
      new CategoryItem(crypto.randomUUID(), "Business", "var(--variant)"),
    ]
  ) {
    this.save();
  }

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
    }[] = JSON.parse(storedCategories);

    this._categories = parsedCategories.map(
      (category) =>
        new CategoryItem(category._id, category._name, category._color)
    );
  }

  save(): void {
    localStorage.setItem("categories", JSON.stringify(this._categories));
  }

  addCategory(category: CategoryItem): void {
    this._categories.push(category);
    this.save();
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
  }
}
