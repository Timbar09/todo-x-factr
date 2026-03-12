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
    this.container = document.getElementById("mainView")!;

    // Initialize composed parts
    this.renderer = new TemplateRenderer(
      this.controller,
      MoreMenuController.getInstance()
    );

    this.ul = this.renderer.getListContainer();

    this.events = new TemplateEvents(
      this.controller,
      this.container,
      () => this.list(),
      templateId => this.selectTemplate(templateId)
    );
  }

  view(): void {
    this.renderer.renderTemplateView(this.container);
    this.events.bindEvents();
  }

  list(): void {
    this.renderer.renderTemplateList(this.ul);
  }

  private selectTemplate(templateId: string): void {
    if (this.controller.activeTemplate.id !== templateId) {
      const template = this.controller.findById(templateId);
      if (template) {
        this.controller.activeTemplate = template;
        this.list();
      }
    }
  }
}
