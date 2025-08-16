import Controller from "../controller/CategoryController";
import Category from "../model/Category";
import Observer from "../types/Observer";

export default class CategoryUI implements Observer<Category> {
  static instance: CategoryUI = new CategoryUI(Controller.instance);

  private controller: Controller;
  private uls: NodeListOf<HTMLUListElement>;
  private previousCompletions: Map<string, number> = new Map();

  constructor(controller: Controller) {
    this.controller = controller;
    this.uls = document.querySelectorAll(
      ".app__category--list"
    ) as NodeListOf<HTMLUListElement>;

    this.init();
  }

  private init(): void {
    this.render();
    this.controller.addCategoryObserver(this);
  }

  update(category: Category): void {
    this.updateCategoryDisplay(category.id);
  }

  private render(): void {
    this.uls.forEach(ul => {
      ul.innerHTML = "";

      this.controller.categories.forEach(category => {
        const li = this.createCategoryElement(category);
        const { completionPercentage } = this.getCategoryStats(category);

        this.previousCompletions.set(category.id, completionPercentage);

        ul.appendChild(li);
      });
    });
  }

  private createCategoryElement(category: Category): HTMLLIElement {
    const { numberOfItems, numberOfCompletedItems, completionPercentage } =
      this.getCategoryStats(category);

    // ✅ Get previous completion for animation
    const previousCompletion = this.previousCompletions.get(category.id) || 0;
    const currentCompletion = completionPercentage;

    console.log(
      `🎬 Animation: ${category.name} from ${previousCompletion}% → ${currentCompletion}%`
    );

    const plural = numberOfItems === 1 ? "" : "s";

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
  `;

    // ✅ Update progress bar with animation
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

    // ✅ Store current as previous for next update
    this.previousCompletions.set(category.id, currentCompletion);

    return li;
  }

  private getCategoryStats(category: Category): {
    numberOfItems: number;
    numberOfCompletedItems: number;
    completionPercentage: number;
  } {
    const completedTasks = Number(category.completedTasks);
    const completionPercentage = Number(category.completionPercentage);

    return {
      numberOfItems: category.tasks.length,
      numberOfCompletedItems: completedTasks,
      completionPercentage: completionPercentage,
    };
  }

  private updateCategoryDisplay(categoryId: string): void {
    const category = this.controller.findCategoryById(categoryId);
    if (!category) return;

    this.uls.forEach(ul => {
      const existingElement = ul.querySelector(
        `[data-category-id="${categoryId}"]`
      );

      if (existingElement) {
        const newElement = this.createCategoryElement(category);

        existingElement.insertAdjacentElement("beforebegin", newElement);

        existingElement.remove();
      }
    });
  }
}
