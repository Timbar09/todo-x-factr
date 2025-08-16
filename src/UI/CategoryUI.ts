// import FullList from "../model/FullList";
import Controller from "../controller/CategoryController";
import Category from "../model/Category";
import Observer from "../types/Observer";

export default class CategoryUI implements Observer<Category> {
  static instance: CategoryUI = new CategoryUI(Controller.instance);

  private controller: Controller;
  private uls: NodeListOf<HTMLUListElement>;

  constructor(controller: Controller) {
    this.controller = controller;
    this.uls = document.querySelectorAll(
      ".app__category--list"
    ) as NodeListOf<HTMLUListElement>;

    this.init();
  }

  private init(): void {
    this.render();
  }

  // ✅ Just use render() for everything
  // notifyChange(): void {
  //   this.render(); // Re-render everything when any category changes
  // }

  update(category: Category): void {
    this.uls.forEach(ul => {
      const categoryCount = ul.querySelector(
        `[data-category-id="${category.id}"] .category__item--count`
      );

      if (!categoryCount) return;

      const { numberOfItems, numberOfCompletedItems } =
        this.getCategoryStats(category);

      categoryCount.innerHTML = `
      <span>${numberOfItems} task${numberOfItems === 1 ? "" : "s"}</span> | <span>${numberOfCompletedItems} completed</span>
      `;
    });
  }

  private render(): void {
    this.uls.forEach(ul => {
      ul.innerHTML = "";

      this.controller.categories.forEach(category => {
        const li = document.createElement("li");
        li.className = "category__item";
        li.setAttribute("data-category-id", category.id);
        li.style.setProperty("--category-clr", category.color);

        const { numberOfItems, numberOfCompletedItems, completionPercentage } =
          this.getCategoryStats(category);

        const plural = numberOfItems === 1 ? "" : "s";

        const categoryItem = `
          <span class="category__item--count">
            <span>${numberOfItems} task${plural}</span> | <span>${numberOfCompletedItems} completed</span>
          </span>

          <h4 class="category__item--title">${category.name}</h4>

          <div 
            class="category__item--progressBar" 
            style="--progress: ${completionPercentage}%;"
          >
            <span class="category__item--progressBar__fill"></span>
          </div>
        `;

        li.innerHTML = categoryItem;

        ul.appendChild(li);
      });
    });
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
}
