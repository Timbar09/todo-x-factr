import FormUI from "../form";
import { FormConfig, FormDataCollection } from "../form/types";
import Controller from "../../controller/CentralController";
import { TemplateFormHandler } from "./TemplateFormHandler";
import { CategoryFormHandler } from "./CategoryFormHandler";

export type ViewType = "home" | "templates" | "categories" | "analytics";

export default class FormDialogManager {
  private main: HTMLElement;
  private dialog: HTMLElement;
  private dragUpDialogButtons: NodeListOf<HTMLElement>;
  private form: FormUI | null;
  private controller: Controller;

  private templateFormHandler: TemplateFormHandler;
  private categoryFormHandler: CategoryFormHandler;

  constructor(main: HTMLElement, controller: Controller) {
    this.main = main;
    this.controller = controller;
    this.dialog = this.getDialog()!;
    this.dragUpDialogButtons = this.getDragUpDialogButtons()!;

    this.form = null;

    this.templateFormHandler = new TemplateFormHandler(controller);
    this.categoryFormHandler = new CategoryFormHandler(controller);
  }

  setDialogContent(view: ViewType, formConfig: FormConfig): void {
    const dialogContent = this.getDialogContent();

    if (dialogContent) {
      dialogContent.innerHTML = "";

      this.dialog.dataset.dialog = view;

      view === "home" || view === "analytics"
        ? this.dialog.classList.add("dialog__none")
        : this.dialog.classList.remove("dialog__none");

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
    const dialogElement = this.getDialogElement();

    this.dialog.classList.remove("hidden");
    dialogElement?.removeAttribute("inert");
  }

  dragDownDialog(): void {
    const dialogElement = this.getDialogElement();

    this.dialog.classList.add("hidden");
    dialogElement?.setAttribute("inert", "");
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

    this.dragUpDialogButtons.forEach(button => {
      button.addEventListener("click", () => {
        this.dragUpDialog();
      });
    });

    this.getApp()?.addEventListener("click", event => {
      const target = event.target as HTMLElement;

      if (target.classList.contains("item__edit")) {
        const view = this.getDialog()?.dataset.dialog;

        if (!view && !target.dataset.itemId) return;

        let itemController;

        switch (view) {
          case "templates":
            itemController = this.controller.template;
            break;
          case "categories":
            itemController = this.controller.category;
            break;
          default:
            console.warn(`The view "${view}" does not support item editing.`);
        }

        const item = itemController?.findById(target.dataset.itemId!);

        this.dragUpDialog();
        this.form?.editItem(item);
      }
    });
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

  private getDragUpDialogButtons(): NodeListOf<HTMLElement> | null {
    return this.main.querySelectorAll(".app__view--button");
  }

  private getForm(): HTMLFormElement | null {
    return this.dialog.querySelector(".form");
  }
}
