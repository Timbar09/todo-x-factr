import Task from "../../model/Task";
import Controller from "../../controller/CentralController";
import MoreMenuController, {
  MoreMenuConfig,
} from "../../controller/MoreMenuController";

export default class TaskRenderer {
  private controller: Controller;
  private moreMenuController: MoreMenuController;
  private ulHeaderMenuContainer: HTMLElement;
  private ul: HTMLUListElement;

  constructor(controller: Controller) {
    this.controller = controller;
    this.moreMenuController = MoreMenuController.getInstance();
    this.ulHeaderMenuContainer = this.getUlHeader()!;
    this.ul = this.getUl()!;
  }

  renderTaskList(): void {
    const headerMenu = this.createTaskListHeaderMenu();
    this.ulHeaderMenuContainer.innerHTML = "";
    this.ulHeaderMenuContainer.appendChild(headerMenu);

    const tasks = this.controller.task.list;

    this.ul.innerHTML = "";

    tasks.forEach(task => {
      const li = this.createTaskElement(task);
      this.ul.appendChild(li);
    });
  }

  createTaskElement(task: Task): HTMLLIElement {
    const category = this.controller.category.findById(task.categoryId);
    const checkboxOutlineColor = category ? category.color : "var(--text-200)";
    const isChecked = task.checked ? "checked" : "";

    const li = document.createElement("li");
    li.className = "task__item";
    li.setAttribute("data-item-id", task.id);

    li.innerHTML = `
      <label for="${task.id}" class="task__item--label">
        <input 
          type="checkbox" 
          id="${task.id}"
          class="task__item--label__checkbox" 
          ${isChecked} 
          style="--outline-color: ${checkboxOutlineColor}"
        />
        <span class="task__item--label__text">${task.title}</span>
      </label>
    `;

    // Add menu to task element
    const moreMenu = this.createTaskMenu(task.id);
    li.appendChild(moreMenu);

    return li;
  }

  createTaskListHeaderMenu(): HTMLElement {
    const menuConfig: MoreMenuConfig = {
      options: [
        {
          id: "clearTasksButton",
          label: "Clear all tasks",
          onClick: () => {
            this.controller.clearAllTasks();
            this.renderTaskList();
          },
        },
        {
          id: "clearCompletedTasksButton",
          label: "Clear completed tasks",
          onClick: () => {
            this.controller.clearCompletedTasks();
            this.renderTaskList();
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
          itemId: taskId,
          label: "Edit task",
          onClick: () => {
            // Dialog will handle this
          },
        },
        {
          id: "deleteTaskButton",
          itemId: taskId,
          label: "Delete task",
          onClick: () => {
            this.deleteTask(taskId);
          },
        },
      ],
    };

    return this.moreMenuController.createMenu(menuConfig);
  }

  private deleteTask(taskId: string): void {
    this.controller.deleteTask(taskId);
    this.renderTaskList();
  }

  private getUl(): HTMLUListElement {
    return document.getElementById("todayTaskList") as HTMLUListElement;
  }

  private getUlHeader(): HTMLElement {
    return document.querySelector(
      ".task__list--today__header--more"
    ) as HTMLElement;
  }
}
