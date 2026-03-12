import Task from "../../model/Task";
import Controller from "../../controller/CentralController";
import MoreMenuController, {
  MoreMenuConfig,
} from "../../controller/MoreMenuController";
import TaskEvents from "./TaskEvents";

export default class TaskRenderer {
  private controller: Controller;
  private moreMenuController: MoreMenuController;
  private bindEvents: TaskEvents | null = null;

  constructor(controller: Controller) {
    this.controller = controller;

    this.moreMenuController = MoreMenuController.getInstance();
  }

  renderTaskView(container: HTMLElement): void {
    container.innerHTML = "";

    container.className = "main__view main__view--tasks";

    container.innerHTML = `
      <header class="main__view--header p-2">
        <h2 class="main__view--title">Your Tasks</h2>

        <div class="main__view--actions">
          <button
            id="addNewTask"
            aria-label="Add new task"
            class="button button__primary button__primary--bar main__view--button main__view--button__add"
            data-view="tasks"
          >
            <span>New Task</span>
            <span class="material-symbols-outlined">Add</span>
          </button>
        </div>
      </header>

      <ul id="taskList" class="task__list px-2">
        <!-- Tasks are dynamically generated -->
      </ul>`;

    const listContainer = container.querySelector(
      "#taskList"
    ) as HTMLUListElement;

    this.renderTaskList(listContainer);

    if (!this.bindEvents) {
      this.bindEvents = new TaskEvents(listContainer, this.controller, () =>
        this.renderTaskList(listContainer)
      );
    }
  }

  renderTaskList(container: HTMLUListElement): void {
    const tasks = this.controller.task.list;

    container.innerHTML = "";

    tasks.forEach(task => {
      const li = this.createTaskElement(task);
      container.appendChild(li);
    });
  }

  renderTodaysTasks(container: HTMLUListElement): void {
    container.innerHTML = "";

    container.innerHTML =
      "<div>We don't have code to display tasks for today yet!</div>";
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

  // getListContainer(): HTMLUListElement {
  //   return document.querySelector("#taskList") as HTMLUListElement;
  // }

  // getListContainer(): HTMLUListElement {
  //   // if (this.listContainer) return this.listContainer;

  //   // const el = document.querySelector("#taskList") as HTMLUListElement | null;
  //   // if (!el) {
  //   //   throw new Error("Task list container (#taskList) is not available yet.");
  //   // }
  //   // return this.view?.querySelector("#taskList") as HTMLUListElement;
  // }
}
