import Controller from "../../controller/CentralController";
import Template from "../../model/Template";
import TemplateUtils from "../template/TemplateUtils";
import { FormDataCollection } from "../form/types";

export class TemplateFormHandler {
  private controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
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
}
