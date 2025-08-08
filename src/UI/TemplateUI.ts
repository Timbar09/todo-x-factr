import TemplateController from "../controller/TemplateController.js";
import Template, { ColorScheme } from "../model/Template.js";
export class TemplateUI {
  private templateController: TemplateController;
  private templateList: HTMLElement;
  private menuContent: HTMLElement;
  private dialog: HTMLElement;

  constructor(templateController: TemplateController) {
    this.templateController = templateController;
    this.menuContent = document.getElementById("menuContent")!;
    this.templateList = document.createElement("ul");
    this.dialog = this.createCustomTemplateDialog();

    this.init();
  }

  private init(): void {
    this.renderTemplates();
    this.bindEvents();
  }

  private renderTemplates(): void {
    const templates = this.templateController.getAllTemplates();
    const currentTemplate = this.templateController.getCurrentTemplate();

    this.templateList.innerHTML = templates
      .map(template =>
        this.createTemplateHTML(template, template.id === currentTemplate.id)
      )
      .join("");

    this.menuContent.innerHTML = `
      <h3 class="menu__title template__title">Choose a Template</h3>

      <ul id="templateList" class="template__list">
        ${this.templateList.innerHTML}
      </ul>

      <div class="template__actions">
        <button
          id="addCustomTemplate"
          class="button button__primary button__primary--bar template__button--entry"
        >
          <span>New Template</span>
          <span class="material-symbols-outlined">Keyboard_arrow_up</span>
        </button>
      </div>
    `;

    this.showCustomTemplateDialog();
  }

  private createTemplateHTML(template: Template, isActive: boolean): string {
    const isActiveClass = isActive ? "template__button--active" : "";
    console.log(template);
    const colorScheme = {
      primary: template.colors.primary,
      variant: template.colors.variant,
      "bg-100": template.colors["bg-100"],
      "bg-300": template.colors["bg-300"],
      "text-100": template.colors["text-100"],
    };

    const cssVars = {
      "--template-bg-color": colorScheme["bg-100"],
      "--template-bg-color-hover": colorScheme["bg-300"],
      "--template-text-color": colorScheme["text-100"],
    };
    const cssVarString = Object.entries(cssVars)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ");

    const colorItems = Object.entries(colorScheme)
      .map(([key, color]) => {
        return `<span class="template__color--item" style="--template-color: ${color}" title="${key}"></span>`;
      })
      .join("");

    return `
      <li class="template__item" style="${cssVarString}">
        <button
          class="template__item--button button ${isActiveClass}"
          data-template="${template.id}"
        >
          <span class="template__item--status">
            ${isActive ? '<span class="material-symbols-outlined">check</span>' : ""}
          </span>

          <span class="template__item--text">${template.name}</span>

          <span class="template__color--list">
            ${colorItems}
          </span>
        </button>
      </li>
    `;
  }

  private bindEvents(): void {
    // Template selection and button clicks - use event delegation
    this.menuContent.addEventListener("click", e => {
      const target = e.target as Element;

      // Handle template selection
      const templateButton = target.closest(
        ".template__item--button"
      ) as HTMLButtonElement;
      if (templateButton) {
        const templateId = templateButton.dataset.template!;
        this.selectTemplate(templateId);
        return;
      }

      // ✅ Handle add custom template button with event delegation
      const addButton = target.closest(
        "#addCustomTemplate"
      ) as HTMLButtonElement;
      if (addButton) {
        e.stopPropagation();
        this.dragUpCustomTemplateDialog();
        return;
      }
    });

    // Drag up custom template dialog
    const customDialogDragHandle = this.dialog.querySelector(
      ".template__dialog--button__toggle"
    ) as HTMLButtonElement;
    if (customDialogDragHandle) {
      customDialogDragHandle.addEventListener("click", e => {
        e.stopPropagation();
        this.dragCustomTemplateDialog();
      });
    }

    // Listen for template changes
    window.addEventListener("templateChanged", () => {
      this.renderTemplates();
    });

    // Listen for menu close event
    window.addEventListener("menuClosed", () => {
      this.dragDownCustomTemplateDialog();
    });
  }

  private selectTemplate(templateId: string): void {
    if (this.templateController.setTemplate(templateId)) {
      this.renderTemplates();
    }
  }

  private dragUpCustomTemplateDialog(): void {
    this.dialog.classList.remove("closed");
    this.dialog.classList.add("open");
  }

  private dragDownCustomTemplateDialog(): void {
    this.dialog.classList.remove("open");
    this.dialog.classList.add("closed");
  }

  private dragCustomTemplateDialog(): void {
    const isDialogOpen = this.dialog.classList.contains("open");

    isDialogOpen
      ? this.dragDownCustomTemplateDialog()
      : this.dragUpCustomTemplateDialog();
  }

  private showCustomTemplateDialog(): void {
    this.menuContent.appendChild(this.dialog);
  }

  private createCustomTemplateDialog(): HTMLElement {
    const dialog = document.createElement("div");
    dialog.className = "template__dialog padding closed";
    dialog.innerHTML = `
      <header class="template__dialog--header">
        <h3 class="offscreen">Create Custom Template</h3>

        <button class="button button__round template__dialog--button__toggle">
          <span class="material-symbols-outlined">drag_handle</span>
        </button>
      </header>

      <div class="form__container">
        <form id="customTemplateForm" class="form template__form">
          <div class="form__field">
          <input type="text" id="templateName" name="templateName" placeholder="Enter template name" required>
          <label for="templateName" class="offscreen">Template Name</label>
          </div>

          <fieldset class="form__fieldset form__colors">
            <legend class="form__fieldset--legend">
              <span class="">Select Colors</span>
            </legend>

            <div class="form__field form__field__color">
            <input type="color" id="primaryColor" name="primaryColor" value="#6366f1">
            <label for="primaryColor" class="form__field__color--label">Primary</label>
            </div>

            <div class="form__field form__field__color">
            <input type="color" id="textColor" name="textColor" value="#ffffff">
            <label for="textColor" class="form__field__color--label">Text</label>
            </div>

            <div class="form__field form__field__color">
            <input type="color" id="bgColor" name="bgColor" value="#0f172a">
            <label for="bgColor" class="form__field__color--label">Background</label>
            </div>
          </fieldset>

          <div class="form__actions">
          <button type="submit" class="button button__primary button__primary--bar">
            <span>Create Template</span>
            <span class="material-symbols-outlined">Keyboard_arrow_up</span>
          </button>

            <button type="button" class="button" id="cancelCustomTemplate">Cancel</button>
          </div>
        </form>
      </div>
    `;

    // Handle form submission
    const form = dialog.querySelector("#customTemplateForm") as HTMLFormElement;
    form.addEventListener("submit", e => {
      e.preventDefault();
      e.stopPropagation();
      // this.clearFormFields(form);
      this.handleCustomTemplateSubmission(form, dialog);
    });

    // Handle cancel button
    const cancelButton = dialog.querySelector(
      "#cancelCustomTemplate"
    ) as HTMLButtonElement;
    cancelButton.addEventListener("click", e => {
      e.stopPropagation();
      this.dragCustomTemplateDialog();
      this.clearFormFields(form);
    });

    return dialog;
  }

  private clearFormFields(form: HTMLFormElement): void {
    form.reset();
  }

  private handleCustomTemplateSubmission(
    form: HTMLFormElement,
    dialog: HTMLElement
  ): void {
    const formData = new FormData(form);

    dialog.classList.add("open");

    const name = formData.get("templateName") as string;
    const primary = formData.get("primaryColor") as string;
    const text = formData.get("textColor") as string;
    const bg = formData.get("bgColor") as string;

    const colors: ColorScheme = {
      primary,
      "text-100": text,
      "text-200": this.reduceOpacity(text, 0.7),
      "text-300": this.reduceOpacity(text, 0.5),
      "text-400": this.reduceOpacity(text, 0.125),
      variant: primary,
      "bg-100": bg,
      "bg-200": this.lightenColor(bg, 10),
      "bg-300": this.lightenColor(bg, 20),
    };

    const customTemplate: Template = new Template(
      `custom-${Date.now()}`,
      name.trim(),
      colors
    );

    this.templateController.addCustomTemplate(customTemplate);
    this.renderTemplates();
    // this.clearFormFields(form);
    this.dragDownCustomTemplateDialog();
  }

  private reduceOpacity(color: string, opacity: number): string {
    return (
      color +
      Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")
    );
  }

  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }
}
