import CategoryList from "../model/CategoryList";

interface DOMList {
  option: HTMLOptionElement;
  render(categoryList: CategoryList, select: HTMLSelectElement): void;
}

export default class CategoryOptionsTemplate implements DOMList {
  option: HTMLOptionElement;

  static instance: CategoryOptionsTemplate = new CategoryOptionsTemplate({
    id: "",
    name: "",
    color: "",
  });

  private constructor(category: { id: string; name: string; color: string }) {
    this.option = document.createElement("option");
    this.option.id = category.id;
    this.option.value = category.name;
    this.option.textContent = category.name;
    this.option.setAttribute("data-color", category.color);
  }

  render(categoryList: CategoryList, select: HTMLSelectElement): void {
    categoryList.categories.forEach((category) => {
      const option = new CategoryOptionsTemplate(category).option;
      select.appendChild(option);
    });
  }
}
