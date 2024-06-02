import CategoryList from "../model/CategoryList";

interface DOMList {
  select: HTMLSelectElement;
  render(categoryList: CategoryList): void;
}

export default class CategoryOptionsTemplate implements DOMList {
  select: HTMLSelectElement;

  static instance: CategoryOptionsTemplate = new CategoryOptionsTemplate();

  private constructor() {
    this.select = document.getElementById(
      "categorySelect"
    ) as HTMLSelectElement;
  }

  render(categoryList: CategoryList) {
    categoryList.categories.forEach((category) => {
      const option = document.createElement("option");

      option.value = category.id;
      option.textContent = category.name;
      option.setAttribute("data-color", category.color);

      this.select.appendChild(option);
    });
  }
}
