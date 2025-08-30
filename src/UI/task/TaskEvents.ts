import Controller from "../../controller/CentralController";
import TaskDialog from "./TaskDialog";

export default class TaskEvents {
  private controller: Controller;
  private app: HTMLElement;
  private dialog: TaskDialog;

  constructor(app: HTMLElement, controller: Controller, dialog: TaskDialog) {
    this.app = app;
    this.controller = controller;
    this.dialog = dialog;
  }

  bindEvents(): void {
    this.bindDialogEvents();
    this.bindTaskEvents();
  }

  private bindDialogEvents(): void {
    this.app.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;

      // Open task dialog
      if (target.closest("#openTaskDialogButton")) {
        this.dialog.openDialog();
      }

      // Close task dialog
      if (target.closest("#closeTaskDialogButton")) {
        this.dialog.closeDialog();
      }
    });
  }

  private bindTaskEvents(): void {
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
