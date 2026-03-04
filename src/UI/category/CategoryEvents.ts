import Controller from "../../controller/CentralController";

export default class CategoryEvents {
  private controller: Controller;
  private onRender: () => void;
  private isBound: boolean = false;

  constructor(controller: Controller, onRender: () => void) {
    this.controller = controller;
    this.onRender = onRender;
  }

  bindEvents(): void {
    if (this.isBound) return;
    this.isBound = true;

    this.bindCategoryActions();
  }

  private bindCategoryActions(): void {
    // Add category
    window.addEventListener("categoryAdded", () => {
      this.onRender();
    });

    // Delete category
    window.addEventListener("deleteCategory", (e: Event) => {
      const event = e as CustomEvent;
      const categoryId = event.detail.categoryId;

      this.handleDeleteCategory(categoryId);
    });
  }

  private handleDeleteCategory(categoryId: string): void {
    const category = this.controller.category.findById(categoryId);
    if (!category) {
      console.error(`Category with ID ${categoryId} not found.`);
      return;
    }

    const confirmMessage = `Delete "${category.name}" category?\n\nAll tasks in this category will still be accessible but will not belong to any category.`;

    if (confirm(confirmMessage)) {
      this.controller.deleteCategory(categoryId);
      this.onRender();
    }
  }
}
