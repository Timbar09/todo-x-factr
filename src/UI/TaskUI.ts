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
  }

  clearUl(): void {
    this.ul.innerHTML = "";
  }

  render(): void {
    const tasks = this.controller.tasks;

    this.clearUl();

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
    li.className = "app__task--list__item";

    li.innerHTML = `
      <div class="app__task--list__item--checkbox">
        <input 
          type="checkbox" 
          id="${task.id}" 
          ${isChecked} 
          style="--outline-color: ${checkboxOutlineColor}"
        />

        <label for="${task.id}">
          <span class="app__task--list__item--text">${task.title}</span>
        </label>
      </div>

      <aside class="more__options">
        <button class="more__options--button" aria-label="More options">
          <span class="material-symbols-outlined">more_vert</span>
        </button>

        <menu class="more__options--menu__list">
          <li class="more__options--menu__item">
            <button 
              id="deleteItem" 
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
}
