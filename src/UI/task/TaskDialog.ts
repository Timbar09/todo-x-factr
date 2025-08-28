import Controller from "../../controller/CentralController";
import FormUI from "../form";
import { FormConfig, FormField, FormDataCollection } from "../form/types";

export default class TaskDialog {
  private controller: Controller;
  private form: FormUI;
  private app: HTMLElement;
  private onSubmit: (data: FormDataCollection) => void;

  constructor(
    app: HTMLElement,
    controller: Controller,
    onSubmit: (data: FormDataCollection) => void
  ) {
    this.app = app;
    this.controller = controller;
    this.onSubmit = onSubmit;
    this.form = this.createForm();
  }

  private createForm(): FormUI {
    const options = this.controller.category.list.map(category => ({
      name: category.name,
      value: category.id,
      variables: [],
    }));

    const fieldsData: FormField[] = [
      {
        label: "Task Title",
        name: "title",
        required: true,
        placeholder: "Enter task title",
      },
      {
        label: "Category",
        name: "categoryId",
        type: "select",
        placeholder: "Select Task Category",
        options: options,
      },
    ];

    const formConfig: FormConfig = {
      title: "Add New Task",
      submitButtonText: "Add Task",
      fieldsData: fieldsData,
      onSubmit: fieldData => {
        this.handleFormSubmit(fieldData);
      },
    };

    return new FormUI(formConfig);
  }

  createDialog(): HTMLElement {
    const dialog = document.createElement("section");
    dialog.id = "taskDialog";
    dialog.className = "task__dialog padding closed";

    dialog.innerHTML = `
      <header class="task__dialog--header">
        <button
          id="closeTaskDialogButton"
          class="button button__round task__dialog--button__close"
          title="Close task dialog"
          aria-label="Close task dialog"
        >
          <span class="material-symbols-outlined"> close </span>
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

  editTask(taskId: string): void {
    const task = this.controller.task.findById(taskId);
    if (task) {
      this.form.editItem(task);
      this.openDialog();
    }
  }

  private getDialog(): HTMLElement | null {
    return this.app.querySelector("#taskDialog");
  }

  private focusFirstInput(): void {
    const dialog = this.getDialog();
    if (!dialog) return;

    const firstInput = dialog.querySelector(
      'input:not([type="hidden"]), textarea, .form__select--custom__button'
    ) as HTMLElement;

    if (firstInput) {
      firstInput.focus();
    }
  }

  private handleFormSubmit(data: FormDataCollection): void {
    this.onSubmit(data);
    this.closeDialog();
  }
}
