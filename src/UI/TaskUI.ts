import Controller from "../controller/TaskController";
import CategoryController from "../controller/CategoryController";
import Task from "../model/Task";
import FormUI, { FormConfig, FormField } from "./FormUI";

export default class TaskUI {
  static instance: TaskUI = new TaskUI(Controller.instance);

  private controller: Controller;
  private categoryController: CategoryController;
  private app: HTMLElement;
  private ul: HTMLUListElement;

  constructor(controller: Controller) {
    this.controller = controller;
    this.categoryController = CategoryController.instance;
    this.app = document.getElementById("application") as HTMLElement;
    this.ul = document.getElementById("todayTaskList") as HTMLUListElement;

    this.app.appendChild(this.createDialog());

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

  private createDialog(): HTMLElement {
    const dialog = document.createElement("section");
    dialog.id = "taskDialog";
    dialog.className = "task__dialog padding closed";

    const categories = this.categoryController.categories;
    const options = categories.map(category => ({
      name: category.name,
      value: category.id,
      variables: [],
    }));

    const fieldsData: FormField[] = [
      {
        label: "Task Title",
        name: "title",
        required: true,
        placeholder: "Enter task title",
      },
      {
        label: "Category",
        name: "categoryId",
        type: "select",
        placeholder: "Select Task Category",
        options: options,
      },
    ];

    const formConfig: FormConfig = {
      title: "Add New Task",
      action: "create",
      submitButtonText: "Add Task",
      fieldsData: fieldsData,
      onSubmit: fieldData => {
        this.handleFormSubmit(fieldData);
        this.closeDialog();
        this.render();
      },
    };

    dialog.innerHTML = `
      <header class="task__dialog--header">
        <button
          id="closeTaskDialogButton"
          class="button button__round task__dialog--button__close"
          title="Close task dialog"
          aria-label="Close task dialog"
        >
          <span class="material-symbols-outlined"> close </span>
        </button>
      </header>
    `;

    const form = new FormUI(formConfig);

    form.renderInto(dialog);

    return dialog;
  }

  private getElById(id: string): HTMLElement | null {
    return this.app.querySelector(`#${id}`);
  }

  private handleFormSubmit(data: Record<string, string>): void {
    const task = new Task(
      crypto.randomUUID(),
      data.title,
      false, // checked
      data.categoryId
    );

    this.controller.addTask(task);
  }

  openDialog(): void {
    const dialog = this.getElById("taskDialog") as HTMLDivElement;

    if (dialog) {
      dialog.classList.remove("closed");
      dialog.classList.add("open");
    }
  }

  closeDialog(): void {
    const dialog = this.getElById("taskDialog") as HTMLDivElement;

    if (dialog) {
      dialog.classList.remove("open");
      dialog.classList.add("closed");
    }
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

    this.app.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;

      // Open task dialog
      if (target.closest("#openTaskDialogButton")) {
        this.openDialog();
      }

      // Close task dialog
      const closeDialogButton = this.getElById(
        "closeTaskDialogButton"
      ) as HTMLButtonElement;
      if (closeDialogButton) {
        closeDialogButton.addEventListener("click", () => {
          this.closeDialog();
        });
      }

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
  }
}
