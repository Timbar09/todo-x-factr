import Controller from "../../controller/CentralController";
import FormUI from "../form";
import { FormConfig, FormField } from "../form/types";
import { CategoryFormData } from "./types";

export default class CategoryDialog {
  private controller: Controller;
  private form: FormUI;
  private app: HTMLElement;
  private onSubmit: (data: CategoryFormData) => void;

  constructor(
    app: HTMLElement,
    controller: Controller,
    onSubmit: (data: CategoryFormData) => void
  ) {
    this.app = app;
    this.controller = controller;
    this.onSubmit = onSubmit;
    this.form = this.createForm();
  }

  private createForm(): FormUI {
    const fieldsData: FormField[] = [
      {
        label: "Category Name",
        name: "name",
        required: true,
        placeholder: "Enter category name",
      },
      {
        label: "Category Color",
        name: "color",
        type: "color",
        placeholder: "#a056c5",
      },
    ];

    const formConfig: FormConfig = {
      title: "Add New Category",
      submitButtonText: "Add Category",
      fieldsData: fieldsData,
      onSubmit: fieldData => {
        this.handleFormSubmit(fieldData);
      },
    };

    return new FormUI(formConfig);
  }

  createDialog(): HTMLElement {
    const dialog = document.createElement("section");
    dialog.id = "categoryDialog";
    dialog.className = "category__dialog padding closed";

    dialog.innerHTML = `
      <header class="category__dialog--header">
        <button
          id="closeCategoryDialogButton"
          class="button button__round category__dialog--button__close"
          title="Close category dialog"
          aria-label="Close category dialog"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>
    `;

    this.form.renderInto(dialog);
    return dialog;
  }

  openDialog(): void {
    const dialog = this.getDialog();
    if (dialog) {
      dialog.classList.remove("closed");
      dialog.classList.add("open");
      this.focusFirstInput();
    }
  }

  closeDialog(): void {
    const dialog = this.getDialog();
    if (dialog) {
      dialog.classList.remove("open");
      dialog.classList.add("closed");
      this.form.reset();
    }
  }

  editCategory(categoryId: string): void {
    const category = this.controller.category.findById(categoryId);
    if (category) {
      // Update form title for editing
      const form = this.getDialog()?.querySelector(".form");
      if (form) {
        const title = form.querySelector(".form__title");
        if (title) title.textContent = "Edit Category";

        const submitBtn = form.querySelector(".form__submit");
        if (submitBtn) submitBtn.textContent = "Update Category";
      }

      // Populate form with category data
      this.form.editItem({
        id: category.id,
        name: category.name,
        color: category.color,
      });

      this.openDialog();
    }
  }

  private getDialog(): HTMLElement | null {
    return this.app.querySelector("#categoryDialog");
  }

  private focusFirstInput(): void {
    const dialog = this.getDialog();
    if (!dialog) return;

    const firstInput = dialog.querySelector(
      'input[name="name"]'
    ) as HTMLElement;
    if (firstInput) {
      firstInput.focus();
    }
  }

  private handleFormSubmit(data: Record<string, string>): void {
    const categoryData: CategoryFormData = {
      name: data.name?.trim() || "",
      color: data.color || "#a056c5",
    };

    if (!categoryData.name) {
      alert("Category name is required");
      return;
    }

    this.onSubmit(categoryData);
    this.closeDialog();
  }
}
