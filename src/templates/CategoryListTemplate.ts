import FullList from "../model/FullList";
import CategoryList from "../model/CategoryList";
import CategoryItem from "../model/CategoryItem";
import Observer from "../types/Observer";

interface DOMList {
  uls: NodeListOf<HTMLUListElement>;
  render(categoryList: CategoryList): void;
}

export default class CategoryListTemplate implements DOMList, Observer<CategoryItem> {
  uls: NodeListOf<HTMLUListElement>;

  static instance: CategoryListTemplate = new CategoryListTemplate();

  private constructor() {
    this.uls = document.querySelectorAll(".app__category--list") as NodeListOf<HTMLUListElement>;
  }

  update(category: CategoryItem): void {
    this.uls.forEach((ul) => {
      const categoryCount = ul.querySelector(
        `[data-category-id="${category.id}"] .app__category--item__count`
      );

      if (!categoryCount) return;

      const numberOfItems = category.items.length;
      categoryCount.textContent = `${numberOfItems} task${numberOfItems === 1 ? "" : "s"}`;
    });
  }

  render(categoryList: CategoryList): void {
    this.uls.forEach((ul) => {
      ul.innerHTML = "";

      categoryList.load();

      categoryList.categories.forEach((category) => {
        const li = document.createElement("li");
        const numberOfItems = category.items.length;

        const fullList = FullList.instance;
        fullList.load();

        const numberOfCompletedItems = category.items.filter(
          (itemId) => fullList.list.find((item) => item.id === itemId)?.checked
        ).length;

        const completionPercentage = Math.round((numberOfCompletedItems / numberOfItems) * 100);

        const liContainer = document.createElement("span");
        liContainer.className = "app__category--item";
        liContainer.title = category.name;
        liContainer.ariaLabel = category.name;
        liContainer.dataset.categoryId = category.id;

        const categoryCount = document.createElement("span");
        categoryCount.className = "app__category--item__count";
        categoryCount.textContent = `${numberOfItems} task${numberOfItems === 1 ? "" : "s"}`;

        const categoryName = document.createElement("h4");
        categoryName.className = "app__category--item__title";
        categoryName.textContent = category.name;

        const categoryProgressBar = document.createElement("div");
        categoryProgressBar.className = "app__category--item__progressBar";
        setTimeout(() => {
          categoryProgressBar.style.setProperty("--progress", `${completionPercentage}%`);
        }, 400);

        const categoryProgressBarFill = document.createElement("span");
        categoryProgressBarFill.className = "app__category--item__progressBar--fill";

        categoryProgressBar.appendChild(categoryProgressBarFill);

        liContainer.appendChild(categoryCount);
        liContainer.appendChild(categoryName);
        liContainer.appendChild(categoryProgressBar);
        li.appendChild(liContainer);

        ul.appendChild(li);
      });
    });
  }
}
