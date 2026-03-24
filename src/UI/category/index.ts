import Controller from "../../controller/CentralController.js";
import Category from "../../model/Category.js";
import CategoryRenderer from "./CategoryRenderer.js";
import { Observer } from "./types.js";
import AppUI from "../AppUI";

export default class CategoryUI extends AppUI implements Observer<Category> {
  static instance: CategoryUI = new CategoryUI(Controller.instance);

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
  }

  // Observer implementation
  update(category: Category): void {
    this.updateCategoryDisplay(
      category.id,
      document.getElementById("categoryList") as HTMLUListElement
    );
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
