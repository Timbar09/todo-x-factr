import CategoryList from "../model/CategoryList";

interface DOMList {
  ul: HTMLUListElement;
  render(categoryList: CategoryList): void;
}

export default class CategoryListTemplate implements DOMList {
  ul: HTMLUListElement;

  static instance: CategoryListTemplate = new CategoryListTemplate();

  private constructor() {
    this.ul = document.getElementById("categoryList") as HTMLUListElement;
  }

  render(categoryList: CategoryList): void {
    this.ul.innerHTML = "";

    categoryList.load();

    categoryList.categories.forEach((category) => {
      const li = document.createElement("li");
      const numberOfItems = category.items.length;

      const liContainer = document.createElement("button");
      liContainer.className = "app__category--item";
      liContainer.title = category.name;
      liContainer.ariaLabel = category.name;

      const categoryCount = document.createElement("span");
      categoryCount.className = "app__category--item__count";
      categoryCount.textContent = `${numberOfItems} task${
        numberOfItems === 1 ? "" : "s"
      }`;

      const categoryName = document.createElement("h4");
      categoryName.className = "app__category--item__title";
      categoryName.textContent = category.name;

      const categoryProgressBar = document.createElement("div");
      categoryProgressBar.className = "app__category--item__progressBar";

      const categoryProgressBarFill = document.createElement("span");
      categoryProgressBarFill.className =
        "app__category--item__progressBar--fill";

      categoryProgressBar.appendChild(categoryProgressBarFill);

      liContainer.appendChild(categoryCount);
      liContainer.appendChild(categoryName);
      liContainer.appendChild(categoryProgressBar);
      li.appendChild(liContainer);

      this.ul.appendChild(li);
    });
  }
}