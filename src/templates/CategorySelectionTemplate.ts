import CategoryList from "../model/CategoryList";
import CategoryItem from "../model/CategoryItem";

import { toggleClass } from "../functions/Reusable";

interface DOMList {
  customSelect: HTMLDivElement;
  dropdown: HTMLUListElement;
  render(categoryList: CategoryList): void;
}

export default class CategorySelectionTemplate implements DOMList {
  customSelect: HTMLDivElement;
  dropdown: HTMLUListElement;

  static instance: CategorySelectionTemplate = new CategorySelectionTemplate();

  private constructor() {
    this.customSelect = document.getElementById("customSelect") as HTMLDivElement;
    this.dropdown = document.getElementById("categoryDropdown") as HTMLUListElement;
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
    selectBox.tabIndex = 0;

    const selectBoxPlaceholder = document.createElement("span");
    selectBoxPlaceholder.textContent = "Select category";

    const selectBoxIcon = document.createElement("span");
    selectBoxIcon.className = "material-symbols-outlined app__task--entry__icon";
    selectBoxIcon.textContent = "keyboard_arrow_down";

    selectBox.appendChild(selectBoxPlaceholder);
    selectBox.appendChild(selectBoxIcon);

    selectBox.addEventListener("click", (event) => {
      this.handleSelectBoxClick(event);
    });
    selectBox.addEventListener("keydown", (event) => {
      if (event.key === "Space" || event.key === "Enter") {
        this.handleSelectBoxClick(event);
      }
    });

    this.customSelect.appendChild(label);
    this.customSelect.appendChild(selectBox);
  }

  private renderDropdown(categoryList: CategoryList) {
    const dropdown = document.getElementById("categoryDropdown") as HTMLDivElement;

    categoryList.categories.forEach((category) => {
      this.renderSelectItem(category);
    });

    this.customSelect.appendChild(dropdown);
  }

  private renderSelectItem(category: CategoryItem) {
    const selectItem = document.createElement("label");
    selectItem.setAttribute("for", category.id);
    selectItem.className = "select-item";
    selectItem.textContent = category.name;
    selectItem.tabIndex = 0;

    selectItem.addEventListener("click", () => {
      this.handleSelectItemClick(category);
    });
    selectItem.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.handleSelectItemClick(category);
        this.closeDropdown();
      }
    });

    const option = document.createElement("input");
    option.type = "radio";
    option.name = "category";
    option.id = category.id;
    option.className = "app__task--category__select";

    this.dropdown.appendChild(selectItem);
  }

  private handleSelectBoxClick(event: Event) {
    event.preventDefault();

    toggleClass(this.dropdown, "open");

    this.rotateIcon();
    this.lockFocus();

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
    const categoryButtonIcon = document.querySelector(".app__task--entry__icon") as HTMLSpanElement;

    if (this.dropdown.classList.contains("open")) {
      categoryButtonIcon.classList.add("open");
    } else {
      categoryButtonIcon.classList.remove("open");
    }
  }

  private lockFocus() {
    if (!this.dropdown.classList.contains("open")) return;

    const focusableElements = this.dropdown.querySelectorAll("input, label") as NodeListOf<
      HTMLInputElement | HTMLLabelElement
    >;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.dropdown.addEventListener("keydown", (event) => {
      if (event.key === "Tab" && event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (event.key === "Tab") {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  private handleSelectItemClick(category: CategoryItem) {
    const categoryColor = document.getElementById("categoryColor") as HTMLDivElement;
    const color: string = category.color;
    const categoryButton = document.getElementById("categoryButton") as HTMLButtonElement;
    const categoryButtonText = categoryButton.querySelector("span") as HTMLSpanElement;

    categoryButtonText.textContent = category.name;
    categoryButton.classList.add("selected");

    categoryColor.style.setProperty("--color", color);
  }
}
