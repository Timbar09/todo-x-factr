import Controller from "../../controller/CentralController.js";
import Category from "../../model/Category.js";
import CategoryRenderer from "./CategoryRenderer.js";
import CategoryEvents from "./CategoryEvents.js";
import { Observer } from "./types.js";

export default class CategoryUI implements Observer<Category> {
  static instance: CategoryUI = new CategoryUI(Controller.instance);

  private controller: Controller;
  private uls: NodeListOf<HTMLUListElement>;
  private previousCompletions: Map<string, number> = new Map();

  // Composed parts
  private renderer: CategoryRenderer;
  private events: CategoryEvents;

  constructor(controller: Controller) {
    this.controller = controller;
    this.uls = this.getUls();

    // Initialize composed parts
    this.renderer = new CategoryRenderer(
      this.controller,
      this.previousCompletions
    );

    this.events = new CategoryEvents(this.controller, () => this.render());

    this.init();
  }

  private init(): void {
    this.render();
    this.events.bindEvents();
    this.controller.category.addCategoryObserver(this);
  }

  // Observer implementation
  update(category: Category): void {
    this.updateCategoryDisplay(category.id);
  }

  private render(): void {
    this.uls.forEach(ul => {
      this.renderer.renderCategoryList(ul);
    });
  }

  private updateCategoryDisplay(categoryId: string): void {
    this.uls.forEach(ul => {
      this.renderer.updateCategoryElement(categoryId, ul);
    });
  }

  refreshDisplay(): void {
    this.render();
  }

  private getUls(): NodeListOf<HTMLUListElement> {
    return document.querySelectorAll(
      ".category__list"
    ) as NodeListOf<HTMLUListElement>;
  }
}
