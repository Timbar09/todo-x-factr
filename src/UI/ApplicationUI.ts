// import Controller from "../../controller/CentralController";
// import TaskRenderer from "./TaskRenderer";

// import TaskRenderer from "./task/TaskRenderer";

export default class ApplicationUI {
  static instance: ApplicationUI = new ApplicationUI();

  // private controller: Controller;
  protected container: HTMLElement;
  private renderer: any;

  constructor() {
    //    this.controller = Controller.instance;
    this.container = document.getElementById("mainViewContent") as HTMLElement;
    // this.renderer = new TaskRenderer(this.controller);
  }

  view(): void {
    this.renderer.renderView(this.container);
  }

  list(ul: HTMLUListElement): void {
    this.renderer.renderList(ul);
  }

  // listToday(ul: HTMLUListElement): void {
  //   this.renderer.renderTodaysTasks(ul);
  // }

  // todaysTaskListMenu(): HTMLElement {
  //   return this.renderer.createTaskListMenu();
  // }
}
