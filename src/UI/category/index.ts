import Controller from "../../controller/CentralController.js";
import Category from "../../model/Category.js";
import CategoryRenderer from "./CategoryRenderer.js";
import CategoryEvents from "./CategoryEvents.js";
// import CategoryDialog from "./CategoryDialog.js";
import { Observer } from "./types.js";

export default class CategoryUI implements Observer<Category> {
  static instance: CategoryUI = new CategoryUI(Controller.instance);

  private controller: Controller;
  private uls: NodeListOf<HTMLUListElement>;
  private previousCompletions: Map<string, number> = new Map();
  private app: HTMLElement;

  // ✅ Composed parts
  private renderer: CategoryRenderer;
  // private dialog: CategoryDialog;
  private events: CategoryEvents;

  constructor(controller: Controller) {
    this.controller = controller;
    this.app = document.getElementById("application") as HTMLElement;
    this.uls = document.querySelectorAll(
      ".app__category--list"
    ) as NodeListOf<HTMLUListElement>;

    // Initialize composed parts
    this.renderer = new CategoryRenderer(
      this.controller,
      this.previousCompletions
    );

    // this.dialog = new CategoryDialog(this.app, this.controller, data =>
    //   this.handleFormSubmit(data)
    // );

    this.events = new CategoryEvents(
      this.app,
      this.controller,
      // this.dialog,
      () => this.render()
    );

    this.init();
  }

  private init(): void {
    this.setupUI();
    this.render();
    this.events.bindEvents();
    this.controller.category.addCategoryObserver(this);
  }

  private setupUI(): void {
    // Add dialog to app
    // const dialog = this.dialog.createDialog();
    // this.app.appendChild(dialog);

    // Add "Add Category" button if it doesn't exist
    this.addCategoryButton();
  }

  private addCategoryButton(): void {
    // Look for category section header to add button
    const categoryHeader = this.app.querySelector(".app__category--header");
    if (categoryHeader && !categoryHeader.querySelector(".add-category-btn")) {
      const addButton = document.createElement("button");
      addButton.className = "add-category-btn button button__primary";
      addButton.innerHTML = `
        <span class="material-symbols-outlined">add</span>
        Add Category
      `;
      categoryHeader.appendChild(addButton);
    }
  }

  // ✅ Your original Observer implementation
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

  public refreshDisplay(): void {
    this.render();
  }

  // ✅ Handle form submissions
  // private handleFormSubmit(data: CategoryFormData): void {
  //   const form = this.app.querySelector(
  //     "#categoryDialog .form"
  //   ) as HTMLFormElement;

  //   if (form?.dataset.mode === "edit") {
  //     const categoryId = form.dataset.itemId;
  //     if (categoryId) {
  //       this.handleFormUpdate(categoryId, data);
  //     }
  //   } else {
  //     this.handleFormCreate(data);
  //   }

  //   this.render();
  // }

  // private handleFormCreate(data: CategoryFormData): void {
  //   const { name, color } = data;
  //   const category = new Category(
  //     crypto.randomUUID(),
  //     name,
  //     color,
  //     [], // empty tasks array
  //     0
  //   );

  //   this.controller.category.add(category);
  // }

  // private handleFormUpdate(id: string, data: CategoryFormData): void {
  //   const { name, color } = data;
  //   const category = this.controller.category.findById(id);

  //   if (category) {
  //     category.updateName(name);
  //     category.updateColor(color);
  //     this.controller.category.update(category);
  //   }
  // }
}
