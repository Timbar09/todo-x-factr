import { toggleMoreOptionsMenu } from "../functions/Reusable";

import FullList from "../model/FullList";
import CategoryList from "../model/CategoryList";
import ListItem from "../model/ListItem";
import ListTemplate from "./ListTemplate";
import CategoryListTemplate from "./CategoryListTemplate";

export default class ListItemTemplate {
  element: HTMLLIElement;

  constructor(
    private item: ListItem,
    private fullList: FullList,
    private categoryList: CategoryList,
    private listTemplate: ListTemplate
  ) {
    this.element = this.createListItemElement(item);
  }

  private createListItemElement(item: ListItem): HTMLLIElement {
    const li = document.createElement("li");
    li.className = "app__task--list__item";
    li.innerHTML = this.getListItemHTML(item);

    const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const moreOptionsButton = li.querySelector(".more__options--button") as HTMLButtonElement;
    const deleteButton = li.querySelector("#deleteItem") as HTMLButtonElement;

    checkbox.addEventListener("change", () => this.handleCheckboxChange());
    moreOptionsButton.addEventListener("click", () => toggleMoreOptionsMenu(moreOptionsButton));
    deleteButton.addEventListener("click", () => this.handleDeleteButtonClick());

    return li;
  }

  private getListItemHTML(item: ListItem): string {
    const checkboxOutlineColor =
      this.categoryList.findCategoryById(item.categoryId)?.color || "var(--text-200)";
    return `
      <div class="app__task--list__item--checkbox">
        <input type="checkbox" id="${item.id}" ${
      item.checked ? "checked" : ""
    } style="--outline-color: ${checkboxOutlineColor}">
        <label for="${item.id}">
          <span class="app__task--list__item--text">${item.title}</span>
        </label>
      </div>

      <div class="more__options">
        <button class="button button__round button more__options--button" aria-label="More options">
          <span class="material-symbols-outlined">more_vert</span>
        </button>

        <ul class="more__options--menu__list">
          <li class="more__options--menu__item">
            <button id="deleteItem" class="more__options--menu__option" aria-label="Delete item">
              Delete task
            </button>
          </li>
        </ul>
      </div>
    `;
  }

  private handleCheckboxChange(): void {
    const categories = CategoryListTemplate.instance;

    this.fullList.checkItem(this.item.id);
    categories.render(this.categoryList);
  }

  private handleDeleteButtonClick(): void {
    this.fullList.removeItem(this.item.id);
    const updatedCategory = this.categoryList.findCategoryById(this.item.categoryId);
    if (updatedCategory) {
      updatedCategory.removeItem(this.item.id);
      this.categoryList.updateCategory(updatedCategory);
    }
    this.listTemplate.render(this.fullList, this.categoryList);
  }
}
