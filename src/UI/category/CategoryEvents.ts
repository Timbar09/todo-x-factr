import Controller from "../../controller/CentralController";
// import CategoryDialog from "./CategoryDialog";

export default class CategoryEvents {
  private controller: Controller;
  private app: HTMLElement;
  // private dialog: CategoryDialog;
  private onRender: () => void;

  constructor(
    app: HTMLElement,
    controller: Controller,
    // dialog: CategoryDialog,
    onRender: () => void
  ) {
    this.app = app;
    this.controller = controller;
    // this.dialog = dialog;
    this.onRender = onRender;
  }

  bindEvents(): void {
    this.bindCategoryActions();
    // this.bindDialogEvents();
    // this.bindAddCategoryButton();
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

  // private bindDialogEvents(): void {
  //   this.app.addEventListener("click", (e: Event) => {
  //     const target = e.target as HTMLElement;

  //     // Open category dialog
  //     if (target.closest("#openCategoryDialogButton")) {
  //       this.dialog.openDialog();
  //     }

  //     // Close category dialog
  //     if (target.closest("#closeCategoryDialogButton")) {
  //       this.dialog.closeDialog();
  //     }
  //   });
  // }

  // private bindAddCategoryButton(): void {
  //   // Look for "Add Category" button in the UI
  //   this.app.addEventListener("click", (e: Event) => {
  //     const target = e.target as HTMLElement;

  //     if (
  //       target.closest(".add-category-btn") ||
  //       target.closest("#addCategoryButton")
  //     ) {
  //       this.dialog.openDialog();
  //     }
  //   });
  // }

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
