import CategoryList from "../model/CategoryList";
import CategoryItem from "../model/CategoryItem";

interface DOMList {
  customSelect: HTMLDivElement;
  render(categoryList: CategoryList): void;
}

export default class CategoryOptionsTemplate implements DOMList {
  customSelect: HTMLDivElement;

  static instance: CategoryOptionsTemplate = new CategoryOptionsTemplate();

  private constructor() {
    this.customSelect = document.getElementById(
      "customSelect"
    ) as HTMLDivElement;
  }

  render(categoryList: CategoryList) {
    this.renderSelectBox();
    this.renderDropdown(categoryList);
  }

  private renderSelectBox() {
    const label = document.createElement("label");
    label.className = "offscreen";
    label.setAttribute("for", "categoryButton");
    label.textContent = "Select a category";

    const selectBox = document.createElement("button");
    selectBox.id = "categoryButton";
    selectBox.className = "app__task--entry__dropdownButton";

    const selectBoxPlaceholder = document.createElement("span");
    selectBoxPlaceholder.textContent = "Select category";

    const selectBoxIcon = document.createElement("span");
    selectBoxIcon.className = "material-symbols-outlined";
    selectBoxIcon.textContent = "keyboard_arrow_down";

    selectBox.appendChild(selectBoxPlaceholder);
    selectBox.appendChild(selectBoxIcon);

    this.customSelect.appendChild(label);
    this.customSelect.appendChild(selectBox);
  }

  private renderDropdown(categoryList: CategoryList) {
    const dropdown = document.getElementById(
      "categoryDropdown"
    ) as HTMLDivElement;

    categoryList.categories.forEach((category) => {
      console.log(category.name);
      this.renderSelectItem(category, dropdown);
    });

    this.customSelect.appendChild(dropdown);
  }

  private renderSelectItem(category: CategoryItem, dropdown: HTMLDivElement) {
    const selectItem = document.createElement("label");
    selectItem.setAttribute("for", category.id);
    selectItem.className = "select-item";
    selectItem.textContent = category.name;

    const option = document.createElement("input");
    option.type = "radio";
    option.name = "category";
    option.id = category.id;
    option.className = "app__task--category__select";

    dropdown.appendChild(selectItem);
  }
}
