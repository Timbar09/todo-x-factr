import CategoryItem from "./CategoryItem";

interface List {
  categories: CategoryItem[];
  load: () => void;
  save: () => void;
  addCategory: (category: CategoryItem) => void;
  findCategoryById: (id: string) => CategoryItem | undefined;
}

export default class CategoryList implements List {
  static instance: CategoryList = new CategoryList();

  private constructor(private _categories: CategoryItem[] = []) {}

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
}
