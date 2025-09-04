import Controller from "../../controller/CentralController.js";
import MoreMenuController, {
  MoreMenuConfig,
} from "../../controller/MoreMenuController.js";
import Category from "../../model/Category.js";
import { CategoryStats } from "./types.js";

export default class CategoryRenderer {
  private controller: Controller;
  private inView: boolean;
  private moreMenuController: MoreMenuController;

  private previousCompletions: Map<string, number>;

  constructor(
    controller: Controller,
    previousCompletions: Map<string, number>
  ) {
    this.controller = controller;
    this.inView = false;
    this.moreMenuController = MoreMenuController.getInstance();

    this.previousCompletions = previousCompletions;
  }

  renderCategoryList(container: HTMLUListElement): void {
    container.innerHTML = "";
    this.inView = this.isCategoriesInView(container);

    this.controller.category.list.forEach(category => {
      const li = this.createCategoryElement(category, this.inView);
      const { completionPercentage } = this.getCategoryStats(category);

      this.previousCompletions.set(category.id, completionPercentage);
      container.appendChild(li);
    });
  }

  createCategoryElement(category: Category, isInView: boolean): HTMLLIElement {
    const flexClass = isInView ? "flex" : "";

    const { numberOfItems, numberOfCompletedItems, completionPercentage } =
      this.getCategoryStats(category);

    const previousCompletion = this.previousCompletions.get(category.id) || 0;
    const currentCompletion = completionPercentage;

    const li = document.createElement("li");
    li.className = "category__item";
    li.setAttribute("data-category-id", category.id);
    li.style.setProperty("--category-clr", category.color);

    li.innerHTML = `
      <header class="category__item--header ${flexClass}">
      ${
        isInView
          ? `
        <!-- display nothing -->
          `
          : `
        <span class="category__item--count">
          <span>${numberOfCompletedItems}</span>/<span>${numberOfItems}</span> tasks completed
        </span>        
        `
      }
      
      <h4 class="category__item--title">${category.name}</h4>
      
      </header>
    `;

    const itemHeader = li.querySelector(".category__item--header");
    const menu = this.createCategoryMenu(category.id);
    console.log(isInView);
    if (itemHeader && isInView) {
      itemHeader.appendChild(menu);
    }

    const progressBar = this.createProgressBar(
      category.id,
      previousCompletion,
      currentCompletion
    );
    li.appendChild(progressBar);

    return li;
  }

  private createProgressBar(
    categoryId: string,
    previousCompletion: number,
    currentCompletion: number
  ): HTMLElement {
    const progressBar = document.createElement("div");
    progressBar.className = "category__item--progressBar";
    progressBar.style.setProperty(
      "--previous-progress",
      `${previousCompletion}%`
    );
    progressBar.style.setProperty("--progress", `${currentCompletion}%`);

    progressBar.innerHTML = `
      <span class="category__item--progressBar__fill"></span>
    `;

    this.previousCompletions.set(categoryId, currentCompletion);

    return progressBar;
  }

  private createCategoryMenu(categoryId: string): HTMLElement {
    const category = this.controller.category.findById(categoryId);

    const menuConfig: MoreMenuConfig = {
      options: [
        {
          id: "editCategoryButton",
          itemId: categoryId,
          label: "Edit Category",
          onClick: () =>
            window.dispatchEvent(
              new CustomEvent("editItem", {
                detail: { item: category },
              })
            ),
        },
        {
          id: "deleteCategoryButton",
          label: "Delete Category",
          onClick: () =>
            window.dispatchEvent(
              new CustomEvent("deleteCategory", {
                detail: { categoryId },
              })
            ),
        },
      ],
    };

    return this.moreMenuController.createMenu(menuConfig);
  }

  updateCategoryElement(categoryId: string, container: HTMLUListElement): void {
    const category = this.controller.category.findById(categoryId);
    if (!category) return;

    const existingElement = container.querySelector(
      `[data-category-id="${categoryId}"]`
    );

    this.inView = this.isCategoriesInView(container);

    if (existingElement) {
      const newElement = this.createCategoryElement(category, this.inView);
      existingElement.insertAdjacentElement("beforebegin", newElement);
      existingElement.remove();
    }
  }

  private getCategoryStats(category: Category): CategoryStats {
    const completedTasks = Number(category.completedTasks);
    const completionPercentage = Number(category.completionPercentage);

    return {
      numberOfItems: category.tasks.length,
      numberOfCompletedItems: completedTasks,
      completionPercentage: completionPercentage,
    };
  }

  private isCategoriesInView(container: HTMLElement): boolean {
    const view = container.closest(".app__view--categories");
    return view !== null;
  }
}
