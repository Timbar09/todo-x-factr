import CategoryItem from "./CategoryItem";

export default class CategoryList {
  private _categories: CategoryItem[] = [];

  get categories(): CategoryItem[] {
    return this._categories;
  }

  addCategory(category: CategoryItem): void {
    this._categories.push(category);
  }

  findCategoryById(id: string): CategoryItem | undefined {
    return this._categories.find((category) => category.id === id);
  }
}
