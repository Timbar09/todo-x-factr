import FormUI from "../form";
import { FormConfig, FormDataCollection } from "../form/types";
import Controller from "../../controller/CentralController";
import Template from "../../model/Template";
import TemplateUtils from "../template/TemplateUtils";

export type ViewType = "home" | "templates" | "categories" | "analytics";

export default class FormDialogManager {
  private main: HTMLElement;
  private dialog: HTMLElement;
  private controller: Controller;

  constructor(main: HTMLElement, controller: Controller) {
    this.main = main;
    this.controller = controller;
    this.dialog = this.getDialog()!;
  }

  setDialogContent(view: ViewType, formConfig: FormConfig): void {
    const dialogContent = this.getDialogContent();

    if (dialogContent) {
      dialogContent.innerHTML = "";

      this.dialog.dataset.dialog = view;

      view === "home"
        ? this.dialog.classList.add("dialog__home")
        : this.dialog.classList.remove("dialog__home");

      formConfig.onSubmit = (data: FormDataCollection) => {
        this.handleFormSubmit(view, data);
      };

      const form = new FormUI(formConfig);
      form.renderInto(dialogContent);
    }
  }

  private handleFormSubmit(view: ViewType, formData: FormDataCollection): void {
    const form = this.getForm();

    if (form?.dataset.mode === "edit") {
      this.handleFormUpdate(view, form, formData);
    } else {
      this.handleFormCreate(view, formData);
    }

    this.dragDownDialog();
  }

  private handleFormUpdate(
    view: ViewType,
    form: HTMLFormElement,
    formData: FormDataCollection
  ): void {
    const itemId = form.dataset.itemId;
    if (itemId) {
      switch (view) {
        case "home":
          console.log(`Updating home item ${itemId}:`, formData);
          break;
        case "templates":
          this.handleTemplateUpdate(itemId, formData);
          break;
        case "categories":
          this.handleCategoryUpdate(itemId, formData);
          break;
        case "analytics":
          this.handleAnalyticsUpdate(itemId, formData);
          break;
        default:
          console.log(`Updating item ${itemId}:`, formData);
      }
    }
  }

  private handleTemplateUpdate(
    itemId: string,
    formData: FormDataCollection
  ): void {
    const { templateName, primaryColor, textColor, bgColor } = formData;

    const colors = TemplateUtils.createColorScheme(
      primaryColor,
      textColor,
      bgColor
    );

    const template = this.controller.template.findById(itemId);
    if (template) {
      template.name = templateName;
      template.colors = colors;
      this.controller.template.update(template);
    }
  }

  private handleCategoryUpdate(
    itemId: string,
    formData: FormDataCollection
  ): void {
    console.log(`Updating category item ${itemId}:`, formData);
  }

  private handleAnalyticsUpdate(
    itemId: string,
    formData: FormDataCollection
  ): void {
    console.log(`Updating analytics item ${itemId}:`, formData);
  }

  private handleFormCreate(view: ViewType, formData: FormDataCollection): void {
    switch (view) {
      case "home":
        console.log(`Creating new home item:`, formData);
        break;
      case "templates":
        this.handleTemplateCreate(formData);
        break;
      case "categories":
        this.handleCategoryCreate(formData);
        break;
      case "analytics":
        this.handleAnalyticsCreate(formData);
        break;
      default:
        console.log(`Creating new ${view} item:`, formData);
    }
  }

  private handleTemplateCreate(formData: FormDataCollection): void {
    const { templateName, primaryColor, textColor, bgColor } = formData;

    const colors = TemplateUtils.createColorScheme(
      primaryColor,
      textColor,
      bgColor
    );

    const template = new Template(
      crypto.randomUUID(),
      false,
      templateName,
      colors
    );
    this.controller.template.add(template);
  }

  private handleCategoryCreate(formData: FormDataCollection): void {
    console.log(`Creating new category item:`, formData);
  }

  private handleAnalyticsCreate(formData: FormDataCollection): void {
    console.log(`Creating new analytics item:`, formData);
  }

  dragDownDialog(): void {
    this.dialog.classList.add("hidden");
  }

  toggleDialog(): void {
    this.dialog.classList.toggle("hidden");
  }

  bindToggleButton(): void {
    const toggleDialogButton = this.dialog.querySelector("#toggleDialogButton");
    if (toggleDialogButton) {
      toggleDialogButton.addEventListener("click", () => {
        this.toggleDialog();
      });
    }
  }

  private getDialog(): HTMLElement | null {
    return this.main.querySelector("#dialog");
  }

  private getDialogContent(): HTMLElement | null {
    return this.dialog.querySelector(".dialog__content");
  }

  private getForm(): HTMLFormElement | null {
    return this.dialog.querySelector(".form");
  }
}
