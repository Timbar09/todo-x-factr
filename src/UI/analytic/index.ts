// import Controller from "../../controller/TemplateController";
// import MoreMenuController from "../../controller/MoreMenuController";
import AnalyticRenderer from "./AnalyticRenderer";
// import TemplateEvents from "./TemplateEvents";
import AppUI from "../AppUI";

export default class AnalyticUI extends AppUI {
  // private controller: Controller;
  // private ul: HTMLUListElement;

  // Composed parts
  private renderer: AnalyticRenderer;
  // private events: TemplateEvents;

  constructor() {
    super();
    // this.controller = Controller.instance;

    // Initialize composed parts
    this.renderer = new AnalyticRenderer();
    //   this.controller,
    //   MoreMenuController.getInstance()
    // );

    // this.ul = this.renderer.getListContainer();

    // this.events = new TemplateEvents(
    //   this.controller,
    //   this.container,
    //   () => this.list(),
    //   templateId => this.selectTemplate(templateId)
    // );
  }

  view(): void {
    this.renderer.renderAnalyticView(this.container);
    // this.events.bindEvents();
  }
}
