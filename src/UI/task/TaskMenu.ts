import Controller from "../../controller/CentralController";
import MoreMenuController, {
  MoreMenuConfig,
} from "../../controller/MoreMenuController";

export default class TaskMenu {
  private controller: Controller;
  private moreMenuController: MoreMenuController;
  private onEdit: (taskId: string) => void;
  private onDelete: (taskId: string) => void;
  private onRender: () => void;

  constructor(
    controller: Controller,
    onEdit: (taskId: string) => void,
    onDelete: (taskId: string) => void,
    onRender: () => void
  ) {
    this.controller = controller;
    this.moreMenuController = MoreMenuController.getInstance();
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    this.onRender = onRender;
  }

  createTaskListHeaderMenu(): HTMLElement {
    const menuConfig: MoreMenuConfig = {
      options: [
        {
          id: "clearTasksButton",
          label: "Clear all tasks",
          onClick: () => {
            this.controller.clearAllTasks();
            this.onRender();
          },
        },
        {
          id: "clearCompletedTasksButton",
          label: "Clear completed tasks",
          onClick: () => {
            this.controller.clearCompletedTasks();
            this.onRender();
          },
        },
      ],
      buttonAriaLabel: "Task list options",
    };

    return this.moreMenuController.createMenu(menuConfig);
  }

  createTaskMenu(taskId: string): HTMLElement {
    const menuConfig: MoreMenuConfig = {
      options: [
        {
          id: "openTaskEditButton",
          label: "Edit task",
          onClick: () => {
            this.onEdit(taskId);
          },
        },
        {
          id: "deleteTaskButton",
          label: "Delete task",
          onClick: () => {
            this.onDelete(taskId);
          },
        },
      ],
    };

    return this.moreMenuController.createMenu(menuConfig);
  }
}
