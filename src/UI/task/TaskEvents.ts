import Controller from "../../controller/CentralController";

export default class TaskEvents {
  private controller: Controller;
  private app: HTMLElement;

  constructor(app: HTMLElement, controller: Controller) {
    this.app = app;
    this.controller = controller;
  }

  bindEvents(): void {
    this.app.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      const taskItem = target.closest(".task__item") as HTMLElement;
      const taskId = taskItem?.dataset.taskId;

      if (!taskId) return;

      // Checkbox toggle
      if (target.matches(".task__item--label__checkbox")) {
        this.controller.toggleTaskCheckStatus(taskId);
        // this.onRender();
      }
    });
  }
}
