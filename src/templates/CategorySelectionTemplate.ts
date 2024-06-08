import CategoryList from "../model/CategoryList";
import CategoryItem from "../model/CategoryItem";

import { toggleClass } from "../functions/Functions";

interface DOMList {
  customSelect: HTMLDivElement;
  dropdown: HTMLUListElement;
  render(categoryList: CategoryList): void;
}

export default class CategoryOptionsTemplate implements DOMList {
  customSelect: HTMLDivElement;
  dropdown: HTMLUListElement;

  static instance: CategoryOptionsTemplate = new CategoryOptionsTemplate();

  private constructor() {
    this.customSelect = document.getElementById(
      "customSelect"
    ) as HTMLDivElement;
    this.dropdown = document.getElementById(
      "categoryDropdown"
    ) as HTMLUListElement;
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
    selectBoxIcon.className =
      "material-symbols-outlined app__task--entry__icon";
    selectBoxIcon.textContent = "keyboard_arrow_down";

    selectBox.appendChild(selectBoxPlaceholder);
    selectBox.appendChild(selectBoxIcon);

    selectBox.addEventListener("click", () => {
      this.handleSelectBoxClick();
    });

    this.customSelect.appendChild(label);
    this.customSelect.appendChild(selectBox);
  }

  private renderDropdown(categoryList: CategoryList) {
    const dropdown = document.getElementById(
      "categoryDropdown"
    ) as HTMLDivElement;

    categoryList.categories.forEach((category) => {
      console.log(category.name);
      this.renderSelectItem(category);
    });

    this.customSelect.appendChild(dropdown);
  }

  private renderSelectItem(category: CategoryItem) {
    const selectItem = document.createElement("label");
    selectItem.setAttribute("for", category.id);
    selectItem.className = "select-item";
    selectItem.textContent = category.name;

    selectItem.addEventListener("click", () => {
      this.handleSelectItemClick(category);
    });

    const option = document.createElement("input");
    option.type = "radio";
    option.name = "category";
    option.id = category.id;
    option.className = "app__task--category__select";

    this.dropdown.appendChild(selectItem);
  }

  private handleSelectBoxClick() {
    toggleClass(this.dropdown, "open");

    this.rotateIcon();

    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (target.closest("#categoryButton")) return;

      this.closeDropdown();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeDropdown();
      }
    });
  }

  private closeDropdown() {
    this.dropdown.classList.remove("open");
    this.rotateIcon();
  }

  private rotateIcon(): void {
    const categoryButtonIcon = document.querySelector(
      ".app__task--entry__icon"
    ) as HTMLSpanElement;

    if (this.dropdown.classList.contains("open")) {
      categoryButtonIcon.classList.add("open");
      console.log(categoryButtonIcon.classList);
    } else {
      categoryButtonIcon.classList.remove("open");
      console.log(categoryButtonIcon.classList);
    }
  }

  private handleSelectItemClick(category: CategoryItem) {
    const categoryColor = document.getElementById(
      "categoryColor"
    ) as HTMLDivElement;
    const color: string = category.color;
    const categoryButton = document.getElementById(
      "categoryButton"
    ) as HTMLButtonElement;
    const categoryButtonText = categoryButton.querySelector(
      "span"
    ) as HTMLSpanElement;

    categoryButtonText.textContent = category.name;
    categoryButton.classList.add("selected");

    categoryColor.style.setProperty("--color", color);
  }
}
