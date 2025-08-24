import Task from "../model/Task";
import Controller from "../controller/TaskController";
import CategoryController from "../controller/CategoryController";
import MoreMenuController, {
  MoreMenuConfig,
} from "../controller/MoreMenuController";
import FormUI, { FormConfig, FormField } from "./FormUI";

export default class TaskUI {
  static instance: TaskUI = new TaskUI(Controller.instance);

  private controller: Controller;
  private categoryController: CategoryController;
  private moreMenuController: MoreMenuController;
  private app: HTMLElement;
  private ul: HTMLUListElement;
  private form: FormUI;

  constructor(controller: Controller) {
    this.controller = controller;
    this.categoryController = CategoryController.instance;
    this.moreMenuController = MoreMenuController.getInstance();
    this.app = document.getElementById("application") as HTMLElement;
    this.ul = document.getElementById("todayTaskList") as HTMLUListElement;

    this.createTaskListHeaderMenu();

    const options = this.categoryController.categories.map(category => ({
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
    const tasks = this.controller.tasks;

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
            this.controller.clearTasks();
            this.render();
          },
        },
        {
          id: "clearCompletedTasksButton",
          label: "Clear completed tasks",
          onClick: () => {
            this.controller.clearCompleted();
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
    const task = this.controller.findTaskById(taskId);

    if (task) {
      this.form.editItem(task);
      this.openDialog();
    }
  }

  private deleteTask(taskId: string): void {
    const task = this.controller.findTaskById(taskId);

    if (task) {
      this.controller.removeTask(task.id);
      this.render();
    }
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
    const form = this.getElById("taskDialog")?.querySelector(
      ".form"
    ) as HTMLFormElement;

    if (form.dataset.mode === "edit") {
      const taskId = form.dataset.itemId;

      if (taskId) {
        const task = this.controller.findTaskById(taskId);

        if (task) {
          task.title = data.title;
          task.categoryId = data.categoryId;
          this.controller.updateTask(task);
        }
      }
    } else {
      const task = new Task(
        crypto.randomUUID(),
        data.title,
        false, // checked
        data.categoryId
      );

      this.controller.addTask(task);
    }

    this.closeDialog();
    this.render();
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
    });
  }
}
