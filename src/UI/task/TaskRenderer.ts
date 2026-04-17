import Task from "../../model/Task";
import Controller from "../../controller/CentralController";
import MoreMenuController, {
  MoreMenuConfig,
} from "../../controller/MoreMenuController";
import TaskEvents from "./TaskEvents";
import { renderViewShell } from "../ViewShell";

export default class TaskRenderer {
  private controller: Controller;
  private moreMenuController: MoreMenuController;
  private events: TaskEvents | null = null;

  constructor(controller: Controller) {
    this.controller = controller;

    this.moreMenuController = MoreMenuController.getInstance();
  }

  renderTaskView(container: HTMLElement): void {
    const listContainer = renderViewShell(container, {
      viewClass: "main__view--tasks",
      title: "Your Tasks",
      addButton: {
        id: "addNewTask",
        ariaLabel: "Add new task",
        text: "New Task",
        dataView: "tasks",
      },
      list: {
        id: "taskList",
        className: "task__list",
        wrapperClassName: "task__list--container px-2",
      },
    });

    this.renderTaskList(listContainer);

    // if (!this.events) {
    //   this.events = new TaskEvents(listContainer, this.controller, () =>
    //     this.renderTaskList(listContainer)
    //   );
    //   this.events.bindEvents();
    // }
  }

  renderTaskList(container: HTMLUListElement, forToday: boolean = false): void {
    const tasks = this.controller.task.list;
    let listToRender = tasks;

    if (forToday) {
      console.warn(
        "Filtering tasks for today unavailable - rendering all tasks instead for now."
      );
      // TODO:For now, just render all tasks. We can filter by today's date later.
    }

    container.innerHTML = "";

    listToRender.forEach(task => {
      const li = this.createTaskElement(task);
      container.appendChild(li);
    });

    if (!this.events) {
      this.events = new TaskEvents(container, this.controller, () =>
        this.renderTaskList(container)
      );
      this.events.bindEvents();
    }

    // TODO: Move this logic into "forToday" branch once we implement actual filtering by today's date.

    const primaryAddTaskButton = this.getPrimaryAddTaskButton();
    const secondaryAddTaskButton = this.getSecondaryAddTaskButton();

    setTimeout(() => {
      if (!primaryAddTaskButton || !secondaryAddTaskButton) {
        return;
      }

      if (listToRender.length > 2) {
        primaryAddTaskButton.classList.add("hidden");
        secondaryAddTaskButton.classList.remove("hidden");
      } else {
        primaryAddTaskButton.classList.remove("hidden");
        secondaryAddTaskButton.classList.add("hidden");
      }
    }, 100);
  }

  // renderTodaysTasks(container: HTMLUListElement): void {
  //   container.innerHTML = "";

  //   // container.innerHTML =
  //   //   "<div>We don't have code to display tasks for today yet!</div>";

  //   this.renderTaskList(container);
  // }

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
          class="task__item--checkbox" 
          ${isChecked} 
          style="--outline-color: ${checkboxOutlineColor}"
        />
        <span class="task__item--title">${task.title}</span>
      </label>
    `;

    // Add menu to task element
    const moreMenu = this.createTaskMenu(task.id);
    li.appendChild(moreMenu);

    return li;
  }

  createTaskListMenu(): HTMLElement {
    const menuConfig: MoreMenuConfig = {
      options: [
        {
          id: "clearTasksButton",
          label: "Clear all tasks",
          onClick: () => {
            window.dispatchEvent(new CustomEvent("clearAllTasks"));
          },
        },
        {
          id: "clearCompletedTasksButton",
          label: "Clear completed tasks",
          onClick: () => {
            window.dispatchEvent(new CustomEvent("clearCompletedTasks"));
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
            // this.deleteTask(taskId);
            window.dispatchEvent(
              new CustomEvent("deleteTask", { detail: { taskId } })
            );
          },
        },
      ],
    };

    return this.moreMenuController.createMenu(menuConfig);
  }

  private getPrimaryAddTaskButton(): HTMLButtonElement | null {
    return document.querySelector(
      ".main__view--home .main__view--button__container"
    ) as HTMLButtonElement;
  }

  private getSecondaryAddTaskButton(): HTMLButtonElement | null {
    return document.querySelector(
      ".main__view--home .task__list--today__header .main__view--button"
    ) as HTMLButtonElement;
  }
}
