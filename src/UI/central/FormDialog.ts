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
  private controller: Controller;

  private templateFormHandler: TemplateFormHandler;
  private categoryFormHandler: CategoryFormHandler;

  constructor(main: HTMLElement, controller: Controller) {
    this.main = main;
    this.controller = controller;
    this.dialog = this.getDialog()!;
    this.dragUpDialogButtons = this.getDragUpDialogButtons()!;

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

      const form = new FormUI(formConfig);
      form.renderInto(dialogContent);
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

    console.log(this.dragUpDialogButtons);

    this.dragUpDialogButtons.forEach(button => {
      button.addEventListener("click", () => {
        console.log("You clicked the DragUpDialog button!");
        this.dragUpDialog();
      });
    });
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
