import Controller from "../../controller/CentralController";
import HomeRenderer from "./HomeRenderer";
import AppUI from "../AppUI";

export default class HomeUI extends AppUI {
  private controller: Controller;
  private renderer: HomeRenderer;

  constructor() {
    super();
    this.controller = Controller.instance;
    this.renderer = new HomeRenderer(this.controller);
  }

  view(): void {
    this.renderer.renderHomeView(this.container);
  }
}
