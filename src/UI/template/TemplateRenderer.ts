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

  renderTemplateView(container: HTMLElement): void {
    container.innerHTML = "";

    container.className = "main__view main__view--templates px-2";

    container.innerHTML = `
      <header class="main__view--header py-2">
        <h2 class="main__view--title">Choose a Template</h2>

        <div class="main__view--actions">
          <button
            id="addNewTemplate"
            aria-label="Add new template"
            class="button button__primary button__primary--bar main__view--button main__view--button__add"
            data-view="templates"
          >
            <span>New Template</span>
            <span class="material-symbols-outlined">Add</span>
          </button>
        </div>
      </header>

      <ul id="templateList" class="template__list">
        <!-- Menu content is dynamically generated -->
      </ul>
      `;

    const listContainer = container.querySelector(
      "#templateList"
    ) as HTMLUListElement;

    this.renderTemplateList(listContainer);
  }

  renderTemplateList(ul: HTMLUListElement): HTMLUListElement {
    const templates = this.controller.list;
    const activeTemplate = this.controller.activeTemplate;

    ul.innerHTML = "";

    templates.forEach(template => {
      const templateHTML = this.createTemplateHTML(
        template,
        template.id === activeTemplate.id
      );

      ul.appendChild(templateHTML);
    });

    return ul;
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
    const template = this.controller.findById(templateId);

    const menuConfig: MoreMenuConfig = {
      options: [
        {
          id: "editTemplateButton",
          itemId: templateId,
          label: "Edit Template",
          onClick: () =>
            window.dispatchEvent(
              new CustomEvent("editItem", {
                detail: { item: template },
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

  getListContainer(): HTMLUListElement {
    return document.querySelector("#templateList") as HTMLUListElement;
  }
}
