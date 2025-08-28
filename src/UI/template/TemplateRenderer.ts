import Template from "../../model/Template";
import Controller from "../../controller/TemplateController";
import MoreMenuController, {
  MoreMenuConfig,
} from "../../controller/MoreMenuController";

export default class TemplateRenderer {
  private controller: Controller;
  private moreMenuController: MoreMenuController;

  constructor(controller: Controller, moreMenuController: MoreMenuController) {
    this.controller = controller;
    this.moreMenuController = moreMenuController;
  }

  renderTemplates(): HTMLUListElement {
    const templates = this.controller.list;
    const activeTemplate = this.controller.activeTemplate;

    const ul = document.createElement("ul");
    ul.className = "template__list";

    templates.forEach(template => {
      const templateHTML = this.createTemplateHTML(
        template,
        template.id === activeTemplate.id
      );

      ul.appendChild(templateHTML);
    });

    return ul;
  }

  renderMenuContent(ul: HTMLUListElement, menuContent: HTMLElement): void {
    menuContent.innerHTML = `
      <h3 class="menu__title template__title">Choose a Template</h3>
    `;

    menuContent.appendChild(ul);

    menuContent.innerHTML += `
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
  }

  private createTemplateHTML(
    template: Template,
    isActive: boolean
  ): HTMLElement {
    const isActiveClass = isActive ? " template__item--active" : "";

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

    const templateCard = document.createElement("li");
    templateCard.className = `template__item${isActiveClass}`;
    templateCard.style.cssText = cssVarString;

    templateCard.innerHTML = `
      <header class="template__item--header">
        <button
          class="template__item--button button"
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

    // Add menu for non-default templates
    if (!template.default) {
      const menu = this.createTemplateMenu(template.id);

      templateCard.appendChild(menu);
    }

    return templateCard;
  }

  private createTemplateMenu(templateId: string): HTMLElement {
    const menuConfig: MoreMenuConfig = {
      options: [
        {
          id: "editTemplateButton",
          label: "Edit Template",
          onClick: () =>
            window.dispatchEvent(
              new CustomEvent("editTemplate", {
                detail: { templateId },
              })
            ),
        },
        {
          id: "deleteTemplateButton",
          label: "Delete Template",
          onClick: () =>
            window.dispatchEvent(
              new CustomEvent("deleteTemplate", {
                detail: { templateId },
              })
            ),
        },
      ],
    };

    return this.moreMenuController.createMenu(menuConfig);
  }
}
