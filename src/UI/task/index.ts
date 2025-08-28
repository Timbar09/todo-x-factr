import Task from "../../model/Task";
import Controller from "../../controller/CentralController";
import TaskRenderer from "./TaskRenderer";
import TaskDialog from "./TaskDialog";
import TaskEvents from "./TaskEvents";
import TaskMenu from "./TaskMenu";
import { FormData } from "../form/types";

export default class TaskUI {
  static instance: TaskUI = new TaskUI();

  private controller: Controller;
  private app: HTMLElement;
  private ul: HTMLUListElement;

  // Composed parts
  private renderer: TaskRenderer;
  private dialog: TaskDialog;
  private events: TaskEvents;
  private menu: TaskMenu;

  constructor() {
    this.controller = Controller.instance;
    this.app = document.getElementById("application") as HTMLElement;
    this.ul = document.getElementById("todayTaskList") as HTMLUListElement;

    // Initialize composed parts
    this.menu = new TaskMenu(
      this.controller,
      taskId => this.editTask(taskId),
      taskId => this.deleteTask(taskId),
      () => this.render()
    );

    this.renderer = new TaskRenderer(this.controller, this.menu);

    this.dialog = new TaskDialog(this.app, this.controller, data =>
      this.handleFormSubmit(data)
    );

    this.events = new TaskEvents(this.app, this.controller, this.dialog, () =>
      this.render()
    );

    this.init();
  }

  private init(): void {
    this.setupUI();
    this.render();
    this.events.bindEvents();
  }

  private setupUI(): void {
    // Add header menu
    const header = this.app.querySelector(".app__task--header") as HTMLElement;
    const headerMenu = this.menu.createTaskListHeaderMenu();
    header.appendChild(headerMenu);

    // Add dialog to app
    const dialog = this.dialog.createDialog();
    this.app.appendChild(dialog);
  }

  render(): void {
    this.renderer.renderTaskList(this.ul);
  }

  // Public methods for external access
  openDialog(): void {
    this.dialog.openDialog();
  }

  closeDialog(): void {
    this.dialog.closeDialog();
  }

  private editTask(taskId: string): void {
    this.dialog.editTask(taskId);
  }

  private deleteTask(taskId: string): void {
    this.controller.deleteTask(taskId);
    this.render();
  }

  private handleFormSubmit(data: FormData): void {
    const form = this.app.querySelector("#taskDialog .form") as HTMLFormElement;

    if (form.dataset.mode === "edit") {
      const taskId = form.dataset.itemId;
      if (taskId) {
        this.handleFormUpdate(taskId, data);
      }
    } else {
      this.handleFormCreate(data);
    }

    this.render();
  }

  private handleFormUpdate(id: string, data: FormData): void {
    const { title, categoryId } = data;
    const task = this.controller.task.findById(id);

    if (task) {
      task.title = title;
      task.categoryId = categoryId || "default";
      this.controller.updateTask(task);
    }
  }

  private handleFormCreate(data: FormData): void {
    const { title, categoryId } = data;
    const task = new Task(
      crypto.randomUUID(),
      title,
      false,
      categoryId || "default"
    );

    this.controller.addTask(task);
  }
}
