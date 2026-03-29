import Controller from "../../controller/CentralController.js";
import Category from "../../model/Category.js";
import CategoryRenderer from "./CategoryRenderer.js";
import { Observer } from "./types.js";
import AppUI from "../AppUI";

export default class CategoryUI extends AppUI implements Observer<Category> {
  private controller: Controller;
  private previousCompletions: Map<string, number> = new Map();

  // Composed parts
  private renderer: CategoryRenderer;

  constructor(controller: Controller) {
    super();
    this.controller = controller;

    // Initialize composed parts
    this.renderer = new CategoryRenderer(
      this.controller,
      this.previousCompletions
    );

    this.controller.category.addCategoryObserver(this);
  }

  // Observer implementation
  update(category: Category): void {
    const categoryViewList = document.getElementById(
      "categoryList"
    ) as HTMLUListElement | null;
    const homeViewList = document.getElementById(
      "homeCategoryList"
    ) as HTMLUListElement | null;

    if (categoryViewList) {
      this.updateCategoryDisplay(category.id, categoryViewList);
    }

    if (homeViewList) {
      this.updateCategoryDisplay(category.id, homeViewList);
    }
  }

  view(): void {
    this.renderer.renderCategoryView(this.container);
  }

  list(ul: HTMLUListElement): void {
    this.renderer.renderCategoryList(ul);
  }

  private updateCategoryDisplay(
    categoryId: string,
    ul: HTMLUListElement
  ): void {
    this.renderer.updateCategoryElement(categoryId, ul);
  }

  // refreshDisplay(): void {
  //   this.render();
  // }

  // private getUls(): NodeListOf<HTMLUListElement> {
  //   return document.querySelectorAll(
  //     ".category__list"
  //   ) as NodeListOf<HTMLUListElement>;
  // }
}
