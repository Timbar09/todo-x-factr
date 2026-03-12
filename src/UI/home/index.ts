import Controller from "../../controller/CentralController";
import HomeRenderer from "./HomeRenderer";

export default class HomeUI {
  static instance: HomeUI = new HomeUI();

  private controller: Controller;
  private container: HTMLElement;
  private renderer: HomeRenderer;

  constructor() {
    this.controller = Controller.instance;
    this.container = document.getElementById("mainView")!;
    this.renderer = new HomeRenderer(this.controller);
  }

  view(): void {
    this.renderer.renderHomeView(this.container);
  }
}
