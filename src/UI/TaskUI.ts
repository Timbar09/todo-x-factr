import Controller from "../controller/TaskController";
import CategoryController from "../controller/CategoryController";
import Task from "../model/Task";

export default class TaskUI {
  static instance: TaskUI = new TaskUI(Controller.instance);

  private controller: Controller;
  private categoryController: CategoryController;
  private ul: HTMLUListElement;

  constructor(controller: Controller) {
    this.controller = controller;
    this.categoryController = CategoryController.instance;
    this.ul = document.getElementById("listItems") as HTMLUListElement;

    this.init();
  }

  private init(): void {
    this.render();
    this.bindEvents();
  }

  render(): void {
    const tasks = this.controller.tasks;

    this.ul.innerHTML = "";

    tasks.forEach(task => {
      const li = this.createTaskElement(task);

      this.ul.appendChild(li);
    });
  }

  private createTaskElement(task: Task): HTMLLIElement {
    const category = this.categoryController.findCategoryById(task.categoryId);
    const checkboxOutlineColor = category ? category.color : "var(--text-200)";
    const isChecked = task.checked ? "checked" : "";

    const li = document.createElement("li");
    li.className = "task__item";
    li.setAttribute("data-task-id", task.id);

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

      <aside class="more__options">
        <button class="more__options--button button button__round" aria-label="More options">
          <span class="material-symbols-outlined">more_vert</span>
        </button>

        <menu class="more__options--menu__list">
          <li class="more__options--menu__item">
            <button 
              id="deleteTaskButton" 
              class="more__options--menu__option" 
              aria-label="Delete item"
            >
              Delete task
            </button>
          </li>
        </menu>
      </aside>
    `;

    return li;
  }

  private getElById(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  private bindEvents(): void {
    const clearTasksButton = this.getElById(
      "clearTasksButton"
    ) as HTMLButtonElement;
    const clearCompletedTasksButton = this.getElById(
      "clearCompletedTasksButton"
    ) as HTMLButtonElement;

    clearTasksButton.addEventListener("click", (): void => {
      this.controller.clearTasks();
      this.render();
    });

    clearCompletedTasksButton.addEventListener("click", (): void => {
      this.controller.clearCompleted();
      this.render();
    });

    this.ul.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;

      const taskItem = target.closest(".task__item") as HTMLElement;
      const taskId = taskItem?.dataset.taskId;

      if (!taskId) return;

      // Checkbox toggle
      if (target.matches(".task__item--label__checkbox")) {
        this.controller.toggleCheckStatus(taskId);
      }

      // More options menu
      if (target.matches(".more__options--menu__option")) {
        // Delete task
        if (target.id === "deleteTaskButton") {
          this.controller.removeTask(taskId);
          this.render();
        }
      }
    });

    // window.addEventListener("taskAdded", this.render.bind(this));
    // // window.addEventListener("taskRemoved", this.render.bind(this));
    // // window.addEventListener("tasksCleared", this.render.bind(this));
    // // window.addEventListener("completedTasksCleared", this.render.bind(this));
    // window.addEventListener("taskToggled", this.render.bind(this));
  }
}
