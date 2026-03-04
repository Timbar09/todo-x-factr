import Controller from "../../controller/CentralController";
import TaskRenderer from "./TaskRenderer";
import TaskEvents from "./TaskEvents";

export default class TaskUI {
  static instance: TaskUI = new TaskUI();

  private controller: Controller;
  private app: HTMLElement;
  private uls: NodeListOf<HTMLUListElement>;

  // Composed parts
  private renderer: TaskRenderer;
  private events: TaskEvents;

  constructor() {
    this.controller = Controller.instance;
    this.app = document.getElementById("application") as HTMLElement;
    this.uls = this.getUls();

    // Initialize composed parts
    this.renderer = new TaskRenderer(this.controller);

    this.events = new TaskEvents(this.app, this.controller, () =>
      this.render()
    );

    this.init();
  }

  private init(): void {
    this.render();
    this.events.bindEvents();
  }

  render(): void {
    this.uls.forEach(ul => {
      this.renderer.renderTaskList(ul);
    });
  }

  private getUls(): NodeListOf<HTMLUListElement> {
    return document.querySelectorAll(
      ".task__list"
    ) as NodeListOf<HTMLUListElement>;
  }
}
