import Controller from "../../controller/CentralController";
import TaskRenderer from "./TaskRenderer";
import AppUI from "../AppUI";

export default class TaskUI extends AppUI {
  private controller: Controller;
  private renderer: TaskRenderer;

  constructor() {
    super();
    this.controller = Controller.instance;
    this.renderer = new TaskRenderer(this.controller);
  }

  view(): void {
    this.renderer.renderTaskView(this.container);
  }

  list(ul: HTMLUListElement): void {
    this.renderer.renderTaskList(ul);
  }

  listToday(ul: HTMLUListElement): void {
    this.renderer.renderTaskList(ul, true);
  }

  todaysTaskListMenu(): HTMLElement {
    return this.renderer.renderTaskListMenu();
  }
}
