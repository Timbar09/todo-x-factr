import Controller from "../../controller/CentralController";
import TaskRenderer from "./TaskRenderer";

export default class TaskUI {
  static instance: TaskUI = new TaskUI();

  private controller: Controller;
  private container: HTMLElement;
  private renderer: TaskRenderer;

  constructor() {
    this.controller = Controller.instance;
    this.container = document.getElementById("mainView") as HTMLElement;
    this.renderer = new TaskRenderer(this.controller);
  }

  view(): void {
    this.renderer.renderTaskView(this.container);
  }

  list(ul: HTMLUListElement): void {
    this.renderer.renderTaskList(ul);
  }

  listToday(ul: HTMLUListElement): void {
    this.renderer.renderTodaysTasks(ul);
  }

  todaysTaskListMenu(): HTMLElement {
    return this.renderer.createTaskListMenu();
  }
}
