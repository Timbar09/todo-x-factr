import FullList from "../model/FullList";
import CategoryList from "../model/CategoryList";
import CategoryItem from "../model/CategoryItem";
import Observer from "../types/Observer";

interface DOMList {
  uls: NodeListOf<HTMLUListElement>;
  render(categoryList: CategoryList): void;
}

export default class CategoryListTemplate
  implements DOMList, Observer<CategoryItem>
{
  uls: NodeListOf<HTMLUListElement>;

  static instance: CategoryListTemplate = new CategoryListTemplate();

  private constructor() {
    this.uls = document.querySelectorAll(
      ".app__category--list"
    ) as NodeListOf<HTMLUListElement>;
  }

  update(category: CategoryItem): void {
    this.uls.forEach(ul => {
      const categoryCount = ul.querySelector(
        `[data-category-id="${category.id}"] .category__item--count`
      );

      if (!categoryCount) return;

      const numberOfItems = category.items.length;
      categoryCount.textContent = `${numberOfItems} task${numberOfItems === 1 ? "" : "s"}`;
    });
  }

  render(categoryList: CategoryList): void {
    this.uls.forEach(ul => {
      ul.innerHTML = "";

      categoryList.load();

      categoryList.categories.forEach(category => {
        const li = document.createElement("li");
        li.className = "category__item";
        li.setAttribute("data-category-id", category.id);
        li.style.setProperty("--category-clr", category.color);

        const numberOfItems = category.items.length;

        const fullList = FullList.instance;
        fullList.load();

        const numberOfCompletedItems = category.items.filter(
          itemId => fullList.list.find(item => item.id === itemId)?.checked
        ).length;

        const completionPercentage = Math.round(
          (numberOfCompletedItems / numberOfItems) * 100
        );
        const plural = numberOfItems === 1 ? "" : "s";

        const categoryItem = `
          <span class="category__item--count">${numberOfItems} task${plural} </span>

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
}
