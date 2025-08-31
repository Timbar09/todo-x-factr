import Controller from "../../controller/CentralController";

export default class CategoryEvents {
  private controller: Controller;
  private app: HTMLElement;
  private onRender: () => void;

  constructor(app: HTMLElement, controller: Controller, onRender: () => void) {
    this.app = app;
    this.controller = controller;
    this.onRender = onRender;
  }

  bindEvents(): void {
    this.bindCategoryActions();
  }

  private bindCategoryActions(): void {
    this.app.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;

      // Edit category
      // if (target.closest(".category__edit-btn")) {
      //   const categoryId = target
      //     .closest(".category__edit-btn")
      //     ?.getAttribute("data-category-id");
      //   if (categoryId) {
      //     this.handleEditCategory(categoryId);
      //   }
      // }

      // Delete category
      if (target.closest(".category__delete-btn")) {
        const categoryId = target
          .closest(".category__delete-btn")
          ?.getAttribute("data-category-id");
        if (categoryId) {
          this.handleDeleteCategory(categoryId);
        }
      }
    });
  }

  // private handleEditCategory(categoryId: string): void {
  //   this.dialog.editCategory(categoryId);
  // }

  private handleDeleteCategory(categoryId: string): void {
    const category = this.controller.category.findById(categoryId);
    if (!category) return;

    const confirmMessage = `Delete "${category.name}" category?\n\nAll tasks in this category will be moved to the default category.`;

    if (confirm(confirmMessage)) {
      this.controller.deleteCategory(categoryId);
      this.onRender();
    }
  }
}
