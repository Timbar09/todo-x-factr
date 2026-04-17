import FormUI from "../form";
import { formData } from "../form/data";
import { FormConfig, FormDataCollection } from "../form/types";
import Controller from "../../controller/CentralController";
import { TemplateFormHandler } from "./TemplateFormHandler";
import { CategoryFormHandler } from "./CategoryFormHandler";
import { TaskFormHandler } from "./TaskFormHandler";

export type ViewType =
  | "home"
  | "templates"
  | "categories"
  | "tasks"
  | "analytics";

export default class FormDialogManager {
  private main: HTMLElement;
  private dialog: HTMLElement;
  private form: FormUI | null;
  private controller: Controller;

  private templateFormHandler: TemplateFormHandler;
  private categoryFormHandler: CategoryFormHandler;
  private taskFormHandler: TaskFormHandler;

  constructor(main: HTMLElement, controller: Controller) {
    this.main = main;
    this.controller = controller;
    this.dialog = this.getDialog()!;
    this.form = null;

    this.templateFormHandler = new TemplateFormHandler(controller);
    this.categoryFormHandler = new CategoryFormHandler(controller);
    this.taskFormHandler = new TaskFormHandler(controller);
  }

  setDialogContent(view: ViewType, formConfig: FormConfig): void {
    const dialogContent = this.getDialogContent();

    if (dialogContent) {
      dialogContent.innerHTML = "";

      this.dialog.dataset.dialog = view;

      switch (view) {
        case "analytics":
          this.dialog.classList.add("dialog__none");
          break;
        case "home":
          this.dialog.classList.remove("dialog__none", "dialog__default");
          this.dialog.classList.add("dialog__home");
          break;
        default:
          this.dialog.classList.remove("dialog__none", "dialog__home");
          this.dialog.classList.add("dialog__default");
      }

      formConfig.onSubmit = (data: FormDataCollection) => {
        this.handleFormSubmit(view, data);
      };

      this.form = new FormUI(formConfig);
      this.form.renderInto(dialogContent);
    }
  }

  private handleFormSubmit(view: ViewType, formData: FormDataCollection): void {
    const form = this.getForm()!;
    const itemId = form?.dataset.itemId || "";

    switch (view) {
      case "home":
        this.taskFormHandler.handleSubmit(itemId, form, formData);
        break;
      case "tasks":
        this.taskFormHandler.handleSubmit(itemId, form, formData);
        break;
      case "templates":
        this.templateFormHandler.handleSubmit(itemId, form, formData);
        break;
      case "categories":
        this.categoryFormHandler.handleSubmit(itemId, form, formData);
        break;
      default:
        console.warn(`The view "${view}" does not support form submissions.`);
    }

    this.dragDownDialog();
  }

  private dragUpDialog(): void {
    const dialog = this.getDialog()!;
    const dialogElement = this.getDialogElement()!;
    const view = this.dialog.dataset.dialog as ViewType;

    if (dialog.classList.contains("dialog__home")) {
      this.dialog.classList.add("open");
      this.dialog.classList.remove("closed", "hidden");
    } else {
      this.dialog.classList.remove("hidden", "closed", "open");
    }

    dialogElement.removeAttribute("inert");
    this.setDialogContent(view, formData[view]);
  }

  dragDownDialog(): void {
    const dialog = this.getDialog()!;
    const dialogElement = this.getDialogElement()!;

    if (dialog.classList.contains("dialog__home")) {
      this.dialog.classList.remove("open", "hidden");
      this.dialog.classList.add("closed");
    } else {
      this.dialog.classList.remove("closed", "open");
      this.dialog.classList.add("hidden");
    }

    dialogElement.setAttribute("inert", "");
  }

  toggleDialog(): void {
    const isHidden = this.dialog.classList.contains("hidden");

    isHidden ? this.dragUpDialog() : this.dragDownDialog();
  }

  bindEvents(): void {
    const toggleDialogButton = this.dialog.querySelector("#toggleDialogButton");
    if (toggleDialogButton) {
      toggleDialogButton.addEventListener("click", () => {
        this.toggleDialog();
      });
    }

    this.main.addEventListener("click", (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest(
        ".main__view--button"
      ) as HTMLElement | null;

      if (button && button.getAttribute("data-view")) {
        const view = button.getAttribute("data-view") as ViewType;

        this.setDialogContent(view, formData[view]);
        this.dragUpDialog();
      }
    });

    this.getApp()?.addEventListener("click", event => {
      const target = event.target as HTMLElement;

      if (target.classList.contains("item__edit")) {
        const view = this.getDialog()?.dataset.dialog;

        const categoriesViewController =
          this.setCategoriesViewController(target);

        let itemController: any;

        switch (view) {
          case "home":
            itemController = this.controller.task;
            break;
          case "templates":
            itemController = this.controller.template;
            break;
          case "categories":
            itemController = categoriesViewController;
            break;
          default:
            console.warn(`The view "${view}" does not support item editing.`);
            return;
        }

        const item = itemController?.findById(target.dataset.itemId!);
        if (!item) return;

        this.dragUpDialog();
        this.form?.editItem(item);
      }
    });
  }

  private setCategoriesViewController(target: HTMLElement): any {
    const isTask = target.closest(".task__item") !== null;

    if (!target.dataset.itemId) {
      console.warn("No item ID found on the clicked element.");
      return;
    }

    if (isTask) {
      this.setDialogContent("tasks", formData["tasks"]);
      return this.controller.task;
    }

    this.setDialogContent("categories", formData["categories"]);
    return this.controller.category;
  }

  // HTML Element Getters
  private getApp(): HTMLElement | null {
    return document.querySelector("#application");
  }

  private getDialog(): HTMLElement | null {
    return this.main.querySelector("#dialogContainer");
  }

  private getDialogElement(): HTMLElement | null {
    return this.dialog.querySelector(".dialog");
  }

  private getDialogContent(): HTMLElement | null {
    return this.dialog.querySelector(".dialog__content");
  }

  private getForm(): HTMLFormElement | null {
    return this.dialog.querySelector(".form");
  }
}
