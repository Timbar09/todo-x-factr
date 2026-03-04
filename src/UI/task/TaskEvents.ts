import Controller from "../../controller/CentralController";

export default class TaskEvents {
  private controller: Controller;
  private app: HTMLElement;
  private onRender: () => void;
  private isBound: boolean = false;

  constructor(app: HTMLElement, controller: Controller, onRender: () => void) {
    this.app = app;
    this.controller = controller;
    this.onRender = onRender;
  }

  bindEvents(): void {
    if (this.isBound) return;
    this.isBound = true;

    this.app.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      const taskItem = target.closest(".task__item") as HTMLElement;
      const taskId = taskItem?.dataset.itemId;

      if (taskId) {
        if (target.matches(".task__item--label__checkbox")) {
          this.controller.toggleTaskCheckStatus(taskId);
        }
      }
    });

    window.addEventListener("taskAdded", () => {
      this.onRender();
    });

    window.addEventListener("taskUpdated", () => {
      this.onRender();
    });

    window.addEventListener("deleteTask", (event: Event) => {
      const customEvent = event as CustomEvent;
      const { taskId } = customEvent.detail;
      this.controller.deleteTask(taskId);
      this.onRender();
    });

    window.addEventListener("clearAllTasks", () => {
      this.controller.clearAllTasks();
      this.onRender();
    });

    window.addEventListener("clearCompletedTasks", () => {
      this.controller.clearCompletedTasks();
      // console.log("Cleared All completed");
      this.onRender();
    });
  }
}
