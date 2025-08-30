import Template from "../../model/Template";
import Controller from "../../controller/TemplateController";
import FormUI from "../form";
import { FormDataCollection } from "../form/types";
import { createFormConfig } from "./data";
import TemplateUtils from "./TemplateUtils";
import { ColorScheme } from "../../model/Template";

export default class TemplateDialog {
  private controller: Controller;
  private dialog: HTMLElement;
  private form: FormUI | null = null;
  private originalColors: ColorScheme | null = null;
  private onSubmit: (data: FormDataCollection) => void;

  constructor(
    controller: Controller,
    onSubmit: (data: FormDataCollection) => void
  ) {
    this.controller = controller;
    this.onSubmit = onSubmit;
    this.dialog = this.createTemplateDialog();
  }

  getDialog(): HTMLElement {
    return this.dialog;
  }

  openDialog(): void {
    this.dialog.classList.remove("closed");
    this.dialog.classList.add("open");

    this.originalColors = this.getCurrentColors();
  }

  closeDialog(): void {
    const form = this.dialog.querySelector(".form") as HTMLFormElement;
    this.dialog.classList.remove("open");
    this.dialog.classList.add("closed");

    this.restoreOriginalColors();

    this.resetDialogToCreateMode(form);
  }

  toggleDialog(): void {
    const isDialogOpen = this.dialog.classList.contains("open");
    isDialogOpen ? this.closeDialog() : this.openDialog();
  }

  editTemplate(templateId: string): void {
    const template = this.controller.findById(templateId);
    if (template && !template.default) {
      this.populateFormForEdit(template);
      this.openDialog();

      setTimeout(() => {
        this.updateLivePreview();
      }, 0);
    }
  }

  private createTemplateDialog(): HTMLElement {
    const dialog = document.createElement("div");
    dialog.className = "template__dialog padding closed";
    dialog.innerHTML = `
      <header class="template__dialog--header">
        <h3 class="offscreen">Create Custom Template</h3>

        <button 
          type="button"
          class="button button__round template__dialog--button__toggle" 
          title="Toggle template entry form" aria-label="Toggle template entry form"
        >
          <span class="material-symbols-outlined">drag_handle</span>
        </button>
      </header>
    `;

    const formConfig = createFormConfig(data => {
      this.handleFormSubmit(data);
    });

    this.form = new FormUI(formConfig);
    this.form.renderInto(dialog);

    setTimeout(() => {
      this.bindColorPreviewEvents();
    }, 0);

    return dialog;
  }

  private bindColorPreviewEvents(): void {
    const colorInputs = this.dialog.querySelectorAll('input[type="color"]');

    colorInputs.forEach(input => {
      input.addEventListener("input", () => {
        this.updateLivePreview();
      });
    });
  }

  private updateLivePreview(): void {
    const form = this.dialog.querySelector(".form") as HTMLFormElement;
    const primaryColor =
      (form.querySelector("#primaryColor") as HTMLInputElement)?.value ||
      "#f13d3d";
    const textColor =
      (form.querySelector("#textColor") as HTMLInputElement)?.value ||
      "#e9c5c5";
    const bgColor =
      (form.querySelector("#bgColor") as HTMLInputElement)?.value || "#000000";

    const previewColors = TemplateUtils.createColorScheme(
      primaryColor,
      textColor,
      bgColor
    );

    this.applyPreviewColors(previewColors);
  }

  private applyPreviewColors(colors: ColorScheme): void {
    const root = document.documentElement;

    if (!this.originalColors) {
      this.originalColors = this.getCurrentColors();
    }

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    document.body.classList.add("template-preview-active");
  }

  private getCurrentColors(): ColorScheme {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    return {
      primary: computedStyle.getPropertyValue("--primary").trim(),
      "text-100": computedStyle.getPropertyValue("--text-100").trim(),
      "text-200": computedStyle.getPropertyValue("--text-200").trim(),
      "text-300": computedStyle.getPropertyValue("--text-300").trim(),
      "text-400": computedStyle.getPropertyValue("--text-400").trim(),
      variant: computedStyle.getPropertyValue("--variant").trim(),
      "bg-100": computedStyle.getPropertyValue("--bg-100").trim(),
      "bg-200": computedStyle.getPropertyValue("--bg-200").trim(),
      "bg-300": computedStyle.getPropertyValue("--bg-300").trim(),
    };
  }

  private restoreOriginalColors(): void {
    if (!this.originalColors) return;

    const root = document.documentElement;

    Object.entries(this.originalColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    document.body.classList.remove("template-preview-active");
    this.originalColors = null;
  }

  private populateFormForEdit(template: Template): void {
    const form = this.dialog.querySelector(".form") as HTMLFormElement;
    const nameInput = form.querySelector("#templateName") as HTMLInputElement;
    const primaryInput = form.querySelector(
      "#primaryColor"
    ) as HTMLInputElement;
    const textInput = form.querySelector("#textColor") as HTMLInputElement;
    const bgInput = form.querySelector("#bgColor") as HTMLInputElement;
    const submitButton = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    // Populate with existing values
    nameInput.value = template.name;
    primaryInput.value = template.colors.primary;
    textInput.value = template.colors["text-100"];
    bgInput.value = template.colors["bg-100"];

    // Change button text and add edit mode
    submitButton.innerHTML = `
      <span>Update Template</span>
      <span class="material-symbols-outlined">Keyboard_arrow_up</span>
    `;

    // Mark form as edit mode
    form.dataset.mode = "edit";
    form.dataset.templateId = template.id;
  }

  private handleFormSubmit(data: FormDataCollection): void {
    const templateData = {
      templateName: data.templateName?.trim() || "",
      primaryColor: data.primaryColor || "#f13d3d",
      textColor: data.textColor || "#e9c5c5",
      bgColor: data.bgColor || "#000000",
    };

    if (!templateData.templateName) {
      alert("Template name is required");
      return;
    }

    this.originalColors = null;
    document.body.classList.remove("template-preview-active");

    this.onSubmit(templateData);
  }

  resetDialogToCreateMode(form: HTMLFormElement): void {
    const submitButton = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    // Reset button text
    submitButton.innerHTML = `
      <span>Create Template</span>
      <span class="material-symbols-outlined">Keyboard_arrow_up</span>
    `;

    // Clear edit mode
    delete form.dataset.mode;
    delete form.dataset.templateId;

    // Clear form
    form.reset();
  }
}
