import Template from "../../model/Template";
import Controller from "../../controller/TemplateController";
import MoreMenuController from "../../controller/MoreMenuController";
import TemplateRenderer from "./TemplateRenderer";
import TemplateDialog from "./TemplateDialog";
import TemplateEvents from "./TemplateEvents";
import TemplateUtils from "./TemplateUtils";
import { FormDataCollection } from "../form/types";

export default class TemplateUI {
  static instance: TemplateUI = new TemplateUI();

  private controller: Controller;
  private container: HTMLElement;
  private ul: HTMLUListElement;

  // Composed parts
  private renderer: TemplateRenderer;
  private dialog: TemplateDialog;
  private events: TemplateEvents;

  constructor() {
    this.controller = Controller.instance;
    this.container = document.getElementById("templatesView")!;
    this.ul = this.container.querySelector("#templateList") as HTMLUListElement;

    // Initialize composed parts
    this.renderer = new TemplateRenderer(
      this.controller,
      MoreMenuController.getInstance()
    );

    this.dialog = new TemplateDialog(this.controller, data =>
      this.handleFormSubmit(data)
    );

    this.events = new TemplateEvents(
      this.controller,
      this.container,
      this.dialog,
      () => this.renderTemplates(),
      templateId => this.selectTemplate(templateId)
    );

    this.init();
  }

  private init(): void {
    this.renderTemplates();
    this.events.bindEvents();
  }

  private renderTemplates(): void {
    this.renderer.renderTemplates(this.ul);
    this.showTemplateDialog();
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

  private showTemplateDialog(): void {
    this.container.appendChild(this.dialog.getDialog());
  }

  private handleFormSubmit(data: FormDataCollection): void {
    const { templateName, primaryColor, textColor, bgColor } = data;
    const form = this.dialog
      .getDialog()
      .querySelector(".form") as HTMLFormElement;

    const colors = TemplateUtils.createColorScheme(
      primaryColor,
      textColor,
      bgColor
    );

    if (form.dataset.mode === "edit") {
      const templateId = form.dataset.templateId!;
      const template = this.controller.findById(templateId);
      if (template) {
        template.name = templateName;
        template.colors = colors;
        this.controller.update(template);
      }
    } else {
      const template = new Template(
        crypto.randomUUID(),
        false,
        templateName,
        colors
      );
      this.controller.add(template);
      this.selectTemplate(template.id);
    }

    this.renderTemplates();
    this.dialog.resetDialogToCreateMode(form);
    this.dialog.closeDialog();
  }
}
