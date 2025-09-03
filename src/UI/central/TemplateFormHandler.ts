import Controller from "../../controller/CentralController";
import Template from "../../model/Template";
import Renderer from "../template/TemplateRenderer";
import MoreMenuController from "../../controller/MoreMenuController";
import TemplateUtils from "../template/TemplateUtils";
import { FormDataCollection } from "../form/types";

export class TemplateFormHandler {
  private controller: Controller;
  private renderer: Renderer;

  constructor(controller: Controller) {
    this.controller = controller;
    this.renderer = new Renderer(
      this.controller.template,
      MoreMenuController.getInstance()
    );
  }

  handleSubmit(
    templateId: string,
    form: HTMLFormElement,
    formData: FormDataCollection
  ): void {
    if (form?.dataset.mode === "edit") {
      this.handleUpdate(templateId, formData);
    } else {
      this.handleCreate(formData);
    }

    this.syncActiveTemplate(templateId);
  }

  private syncActiveTemplate(templateId: string) {
    this.getTemplateLists().forEach(templateList => {
      const activeTemplate = this.controller.template.activeTemplate;

      if (activeTemplate.id === templateId) {
        const newActiveTemplate = this.controller.template.findById(templateId);
        this.controller.template.activeTemplate = newActiveTemplate!;
      } else {
        this.renderer.renderTemplates(templateList);
      }
    });
  }

  private handleCreate(formData: FormDataCollection): void {
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

  private handleUpdate(itemId: string, formData: FormDataCollection): void {
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

  private getTemplateLists(): NodeListOf<HTMLUListElement> {
    return document.querySelectorAll(".template__list");
  }
}
