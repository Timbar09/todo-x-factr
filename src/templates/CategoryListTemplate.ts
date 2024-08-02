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
    this.uls = document.querySelectorAll(".category--list") as NodeListOf<HTMLUListElement>;
  }

  update(category: CategoryItem): void {
    this.uls.forEach((ul) => {
      const categoryCount = ul.querySelector(
        `[data-category-id="${category.id}"] .category--item__count`
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

        const strokeProgress = 82 + (numberOfCompletedItems / numberOfItems) * 70;

        const completionPercentage = Math.round((numberOfCompletedItems / numberOfItems) * 100);
        const { name, id, color } = category;
        const plural = numberOfItems === 1 ? "" : "s";

        const categoryItem = `
          <span class="category--item" title="${name}" aria-label="${name}" data-category-id="${id}">
            <span class="category--item__progressCircle" style="--progress: ${strokeProgress}; --stroke-clr: ${color};">
              <span class="category--item__progressCircle--count">
                ${numberOfItems}
              </span>
              
              <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="13" stroke="currentColor" stroke-width="2" fill="transparent" />
              </svg>
              
              <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="13" stroke="currentColor" stroke-width="2" fill="transparent" />
              </svg>
            </span>

            <span class="category--item__count">${numberOfItems} task${plural} </span>

            <h4 class="category--item__title">${category.name}</h4>
            
            <div class="category--item__progressBar" style="--progress: ${completionPercentage}%;">
              <span class="category--item__progressBar--fill"></span>
            </div>
          </span>
        `;

        li.innerHTML = categoryItem;

        ul.appendChild(li);
      });
    });
  }
}
