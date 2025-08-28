import Controller from "../../controller/CentralController.js";
import Category from "../../model/Category.js";
import { CategoryStats } from "./types.js";

export default class CategoryRenderer {
  private controller: Controller;
  private previousCompletions: Map<string, number>;

  constructor(
    controller: Controller,
    previousCompletions: Map<string, number>
  ) {
    this.controller = controller;
    this.previousCompletions = previousCompletions;
  }

  renderCategoryList(container: HTMLUListElement): void {
    container.innerHTML = "";

    this.controller.category.list.forEach(category => {
      const li = this.createCategoryElement(category);
      const { completionPercentage } = this.getCategoryStats(category);

      this.previousCompletions.set(category.id, completionPercentage);
      container.appendChild(li);
    });
  }

  createCategoryElement(category: Category): HTMLLIElement {
    const { numberOfItems, numberOfCompletedItems, completionPercentage } =
      this.getCategoryStats(category);

    const previousCompletion = this.previousCompletions.get(category.id) || 0;
    const currentCompletion = completionPercentage;

    const li = document.createElement("li");
    li.className = "category__item";
    li.setAttribute("data-category-id", category.id);
    li.style.setProperty("--category-clr", category.color);

    li.innerHTML = `
      <span class="category__item--count">
        <span>${numberOfCompletedItems}</span>/<span>${numberOfItems}</span> tasks completed
      </span>

      <h4 class="category__item--title">${category.name}</h4>

      <div 
        class="category__item--progressBar" 
        style="--previous-progress: ${completionPercentage}%; --progress: ${completionPercentage}%;"
      >
        <span class="category__item--progressBar__fill"></span>
      </div>

      <!-- ✅ Add action buttons for edit/delete -->
      <!-- <div class="category__item--actions">
        <button 
          class="category__edit-btn" 
          data-category-id="${category.id}"
          title="Edit category"
        >
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button 
          class="category__delete-btn" 
          data-category-id="${category.id}"
          title="Delete category"
        >
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div> -->
    `;

    // ✅ Your original animation logic
    const progressBar = li.querySelector(
      ".category__item--progressBar"
    ) as HTMLElement;

    if (progressBar) {
      progressBar.style.setProperty(
        "--previous-progress",
        `${previousCompletion}%`
      );
      progressBar.style.setProperty("--progress", `${currentCompletion}%`);
    }

    this.previousCompletions.set(category.id, currentCompletion);

    return li;
  }

  updateCategoryElement(categoryId: string, container: HTMLUListElement): void {
    const category = this.controller.category.findById(categoryId);
    if (!category) return;

    const existingElement = container.querySelector(
      `[data-category-id="${categoryId}"]`
    );

    if (existingElement) {
      const newElement = this.createCategoryElement(category);
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
}
