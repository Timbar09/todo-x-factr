import Task from "../model/Task";
import Controller from "../controller/CentralController";
import MoreMenuController, {
  MoreMenuConfig,
} from "../controller/MoreMenuController";
import FormUI, { FormConfig, FormField } from "./FormUI";

export default class TaskUI {
  static instance: TaskUI = new TaskUI();

  private controller: Controller;
  private moreMenuController: MoreMenuController;
  private app: HTMLElement;
  private ul: HTMLUListElement;
  private form: FormUI;

  constructor() {
    this.controller = Controller.instance;
    this.moreMenuController = MoreMenuController.getInstance();
    this.app = document.getElementById("application") as HTMLElement;
    this.ul = document.getElementById("todayTaskList") as HTMLUListElement;

    this.createTaskListHeaderMenu();

    const options = this.controller.category.list.map(category => ({
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
      submitButtonText: "Add Task",
      fieldsData: fieldsData,
      onSubmit: fieldData => {
        this.handleFormSubmit(fieldData);
      },
    };

    this.form = new FormUI(formConfig);

    this.app.appendChild(this.createDialog());

    this.init();
  }

  private init(): void {
    this.render();
    this.bindEvents();
  }

  render(): void {
    const tasks = this.controller.task.list;

    this.ul.innerHTML = "";

    tasks.forEach(task => {
      const li = this.createTaskElement(task);

      this.ul.appendChild(li);
    });
  }

  private createTaskListHeaderMenu(): void {
    const header = this.app.querySelector(".app__task--header")! as HTMLElement;

    const menuConfig: MoreMenuConfig = {
      options: [
        {
          id: "clearTasksButton",
          label: "Clear all tasks",
          onClick: () => {
            this.controller.clearAllTasks();
            this.render();
          },
        },
        {
          id: "clearCompletedTasksButton",
          label: "Clear completed tasks",
          onClick: () => {
            this.controller.clearCompletedTasks();
            this.render();
          },
        },
      ],
      buttonAriaLabel: "Task list options",
    };

    const menu = this.moreMenuController.createMenu(menuConfig);
    header.appendChild(menu);
  }

  private createTaskElement(task: Task): HTMLLIElement {
    const category = this.controller.category.findById(task.categoryId);
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
    `;

    const menuConfig: MoreMenuConfig = {
      options: [
        {
          id: "openTaskEditButton",
          label: "Edit task",
          onClick: () => {
            this.editTask(task.id);
          },
        },
        {
          id: "deleteTaskButton",
          label: "Delete task",
          onClick: () => {
            this.deleteTask(task.id);
          },
        },
      ],
    };

    const moreMenu = this.moreMenuController.createMenu(menuConfig);
    li.appendChild(moreMenu);

    return li;
  }

  private editTask(taskId: string): void {
    const task = this.controller.task.findById(taskId);

    if (task) {
      this.form.editItem(task);
      this.openDialog();
    }
  }

  private deleteTask(taskId: string): void {
    this.controller.deleteTask(taskId);
    this.render();
  }

  private createDialog(): HTMLElement {
    const dialog = document.createElement("section");
    dialog.id = "taskDialog";
    dialog.className = "task__dialog padding closed";

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

    this.form.renderInto(dialog);

    return dialog;
  }

  private getElById(id: string): HTMLElement | null {
    return this.app.querySelector(`#${id}`);
  }

  private handleFormSubmit(data: Record<string, string>): void {
    const form = this.app.querySelector("#taskDialog .form") as HTMLFormElement;

    if (form.dataset.mode === "edit") {
      const taskId = form.dataset.itemId;

      if (taskId) {
        this.#handleFormUpdate(taskId, data);
      }
    } else {
      this.#handleFormCreate(data);
    }

    this.closeDialog();
    this.render();
  }

  #handleFormUpdate(id: string, data: Record<string, string>): void {
    const { title, categoryId } = data;

    const task = this.controller.task.findById(id);

    if (task) {
      task.title = title;
      task.categoryId = categoryId || "default";

      this.controller.updateTask(task);
    }
  }

  #handleFormCreate(data: Record<string, string>): void {
    const { title, categoryId } = data;

    const task = new Task(
      crypto.randomUUID(),
      title,
      false,
      categoryId || "default"
    );

    this.controller.addTask(task);
  }

  openDialog(): void {
    const dialog = this.getElById("taskDialog") as HTMLDivElement;

    if (dialog) {
      dialog.classList.remove("closed");
      dialog.classList.add("open");
      this.focusDialogFormFirstInput();
    }
  }

  closeDialog(): void {
    const dialog = this.getElById("taskDialog") as HTMLDivElement;

    if (dialog) {
      dialog.classList.remove("open");
      dialog.classList.add("closed");
      this.form.reset();
    }
  }

  private focusDialogFormFirstInput(): void {
    const dialogEl = this.getElById("taskDialog") as HTMLDivElement;
    const dialogForm = dialogEl.querySelector(".form") as HTMLFormElement;
    const firstInput = dialogForm.querySelector(
      'input:not([type="hidden"]), textarea, .form__select--custom__button'
    ) as HTMLElement;

    if (firstInput) {
      firstInput.focus();
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
      this.controller.clearAllTasks();
      this.render();
    });

    clearCompletedTasksButton.addEventListener("click", (): void => {
      this.controller.clearCompletedTasks();
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
        this.controller.toggleTaskCheckStatus(taskId);
      }
    });
  }
}
