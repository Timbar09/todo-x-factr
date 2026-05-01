import Controller from "../../controller/TemplateController";
import MenuUI from "../menu";
import TemplateRenderer from "./TemplateRenderer";
import TemplateEvents from "./TemplateEvents";
import AppUI from "../AppUI";

export default class TemplateUI extends AppUI {
  private controller: Controller;
  private ul: HTMLUListElement;

  // Composed parts
  private renderer: TemplateRenderer;
  private events: TemplateEvents;

  constructor() {
    super();
    this.controller = Controller.instance;

    // Initialize composed parts
    this.renderer = new TemplateRenderer(this.controller, new MenuUI());

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
