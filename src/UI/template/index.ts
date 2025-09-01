import Controller from "../../controller/TemplateController";
import MoreMenuController from "../../controller/MoreMenuController";
import TemplateRenderer from "./TemplateRenderer";
import TemplateEvents from "./TemplateEvents";
export default class TemplateUI {
  static instance: TemplateUI = new TemplateUI();

  private controller: Controller;
  private container: HTMLElement;
  private ul: HTMLUListElement;

  // Composed parts
  private renderer: TemplateRenderer;
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

    this.events = new TemplateEvents(
      this.controller,
      this.container,
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
}
