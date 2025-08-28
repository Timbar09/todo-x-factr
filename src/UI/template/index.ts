import Template, { ColorScheme } from "../../model/Template.js";
import Controller from "../../controller/TemplateController.js";
import MoreMenuController from "../../controller/MoreMenuController.js";
import FormUI from "../form";
import { FormConfig, FormField } from "../form/types.js";
export default class TemplateUI {
  static instance: TemplateUI = new TemplateUI();

  private controller: Controller;
  private moreMenuController: MoreMenuController;
  private menuContent: HTMLElement;
  private ul: HTMLUListElement;
  private dialog: HTMLElement;

  constructor() {
    this.controller = Controller.instance;
    this.moreMenuController = MoreMenuController.getInstance();

    this.menuContent = document.getElementById("menuContent")!;

    this.ul = document.createElement("ul");
    this.ul.className = "template__list";

    this.dialog = this.createCustomTemplateDialog();

    this.init();
  }

  private init(): void {
    this.renderTemplates();
    this.bindEvents();
  }

  private renderTemplates(): void {
    const templates = this.controller.list;
    const activeTemplate = this.controller.activeTemplate;

    this.ul.innerHTML = "";

    templates.forEach(template => {
      const templateHTML = this.createTemplateHTML(
        template,
        template.id === activeTemplate.id
      );
      this.ul.appendChild(templateHTML);
    });

    this.menuContent.innerHTML = `
      <h3 class="menu__title template__title">Choose a Template</h3>
    `;

    this.menuContent.appendChild(this.ul);

    this.menuContent.innerHTML += `
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

  private createTemplateHTML(
    template: Template,
    isActive: boolean
  ): HTMLElement {
    const isActiveClass = isActive ? "template__button--active" : "";

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

    const showMoreMenu = template.default ? false : true;

    const menuConfig = {
      options: [
        {
          id: "editTemplateButton",
          label: "Edit Template",
          onClick: () => {
            this.editTemplate(template.id);
          },
        },
        {
          id: "deleteTemplateButton",
          label: "Delete Template",
          onClick: () => {
            const defaultTemplate = this.controller.list.filter(
              template => template.default
            )[0];

            this.controller.removeTemplate(template.id);

            if (template.active) {
              this.selectTemplate(defaultTemplate.id);
            }

            this.renderTemplates();
          },
        },
      ],
    };

    const templateCard = document.createElement("li");
    templateCard.className = "template__item";
    templateCard.style = cssVarString;

    templateCard.innerHTML = `
      <header class="template__item--header">
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
      </header>
  `;

    const menu = this.moreMenuController.createMenu(menuConfig);

    if (showMoreMenu) templateCard.appendChild(menu);

    return templateCard;
  }

  private bindEvents(): void {
    // Template selection and button clicks - use event delegation
    this.menuContent.addEventListener("click", e => {
      const target = e.target as Element;

      // ✅ CRITICAL: Check for MoreMenu clicks first and let them bubble
      const isMoreMenuClick = target.closest(".more__options");
      if (isMoreMenuClick) {
        console.log(
          "MoreMenu click detected in TemplateUI - letting MoreMenuController handle it"
        );
        // Don't handle this here - let MoreMenuController handle it
        return;
      }

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

    // Listen for menu already open event
    window.addEventListener("menuAlreadyOpen", () => {
      this.dragDownCustomTemplateDialog();
    });
  }

  private editTemplate(templateId: string): void {
    const template = this.controller.findById(templateId);
    if (template && !template.default) {
      this.populateFormForEdit(template);
      this.dragUpCustomTemplateDialog();
    }
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
      <span class="material-symbols-outlined"> Keyboard_arrow_up</span>
    `;

    // Mark form as edit mode
    form.dataset.mode = "edit";
    form.dataset.templateId = template.id;
  }

  private selectTemplate(templateId: string): void {
    if (this.controller.activeTemplate.id !== templateId) {
      const template = this.controller.findById(templateId);
      if (template) {
        this.controller.activeTemplate = template;
        this.renderTemplates();
      }
    }
  }

  private dragUpCustomTemplateDialog(): void {
    this.dialog.classList.remove("closed");
    this.dialog.classList.add("open");
  }

  private dragDownCustomTemplateDialog(): void {
    const form = this.dialog.querySelector(".form") as HTMLFormElement;

    this.dialog.classList.remove("open");
    this.dialog.classList.add("closed");
    this.resetDialogToCreateMode(form);
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

        <button 
          type="button"
          class="button button__round template__dialog--button__toggle" 
          title="Toggle template entry form" aria-label="Toggle template entry form"
        >
          <span class="material-symbols-outlined">drag_handle</span>
        </button>
      </header>
      </div>
    `;

    const fieldsData: FormField[] = [
      {
        name: "templateName",
        label: "Template Name",
        type: "text",
        placeholder: "Enter template name",
        required: true,
      },
      {
        name: "primaryColor",
        label: "Select Primary Color",
        type: "color",
        value: "#f13d3d",
        required: true,
      },
      {
        name: "textColor",
        label: "Select Text Color",
        type: "color",
        value: "#e9c5c5",
        required: true,
      },
      {
        name: "bgColor",
        label: "Select Background Color",
        type: "color",
        value: "#000000",
        required: true,
      },
    ];

    const formConfig: FormConfig = {
      title: "Create Custom Template",
      submitButtonText: "Create Template",
      fieldsData: fieldsData,
      onSubmit: data => {
        this.handleFormSubmit(data);
      },
    };

    const form = new FormUI(formConfig);
    form.renderInto(dialog);

    return dialog;
  }

  private handleFormSubmit(data: Record<string, string>): void {
    const { templateName, primaryColor, textColor, bgColor } = data;
    const form = this.dialog.querySelector(".form") as HTMLFormElement;

    const colors: ColorScheme = {
      primary: primaryColor,
      "text-100": textColor,
      "text-200": this.reduceOpacity(textColor, 0.7),
      "text-300": this.reduceOpacity(textColor, 0.5),
      "text-400": this.reduceOpacity(textColor, 0.125),
      variant: primaryColor,
      "bg-100": bgColor,
      "bg-200": this.lightenColor(bgColor, 5),
      "bg-300": this.lightenColor(bgColor, 10),
    };

    if (form.dataset.mode === "edit") {
      const templateId = form.dataset.templateId!;
      const template = this.controller.findById(templateId);
      if (template) {
        template.name = templateName.trim();
        template.colors = colors;
        this.controller.update(template);
      }
    } else {
      const template = new Template(
        crypto.randomUUID(),
        false,
        templateName.trim(),
        colors
      );
      this.controller.add(template);
      this.selectTemplate(template.id);
    }

    this.renderTemplates();
    this.resetDialogToCreateMode(form);
    this.dragDownCustomTemplateDialog();
  }

  private resetDialogToCreateMode(form: HTMLFormElement): void {
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
