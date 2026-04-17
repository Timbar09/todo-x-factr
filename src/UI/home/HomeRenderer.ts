import Controller from "../../controller/CentralController";
import CategoryUI from "../category";
import TaskUI from "../task";

export default class HomeRenderer {
  private controller: Controller;
  private categoryRenderer: CategoryUI;
  private taskRenderer: TaskUI;
  // private listCount: number = 0;
  private parentContainer: HTMLElement | null = null;

  constructor(controller: Controller) {
    this.controller = controller;
    this.categoryRenderer = new CategoryUI(this.controller);
    this.taskRenderer = new TaskUI();
    // this.listCount = this.controller.task.list.length;
  }

  renderHomeView(container: HTMLElement): void {
    container.innerHTML = "";

    container.className = "main__view--content main__view--home";

    container.innerHTML = `
      <header class="main__view--content__header px-2 pt-2">
        <h2 class="main__view--title">What's up, Gorilla?</h2>
      </header>

      <div class="main__view--section px-2">
        <h3 class="main__view--subtitle">Categories</h3>

        <ul id="homeCategoryList" class="category__list">
          <!-- Categories are dynamically rendered here -->
        </ul>
      </div>

      <div class="main__view--section px-2">
        <header class="task__list--today__header">
          <h3 class="main__view--subtitle">Today's tasks</h3>

          <div id="todaysTaskListMenu" class="task__list--today__header--more">
            <!-- Task list menu is dynamically rendered here -->
          </div>
        </header>

        <ul id="todaysTaskList" class="task__list">
          <!-- Task items are dynamically rendered here -->
        </ul>
        </div>

        <div class="main__view--button__container">
          <button
            class="button button__primary button__primary--round main__view--button"
            title="Add new item"
            aria-label="Add new item to list"
            data-view="home"
          >
            <span class="material-symbols-outlined"> add </span>
          </button>
        </div>
        `;

    this.parentContainer = container;

    const categoryList = this.getEl("#homeCategoryList") as HTMLUListElement;
    const taskListMenuContainer = this.getTaskListMenuContainer()!;
    const todaysTaskList = this.getEl("#todaysTaskList") as HTMLUListElement;
    // const addTaskButtonContainer = this.getAddTaskButtonContainer()!;

    const addTaskButton = this.createAddTaskButton();
    const taskListMenu = this.taskRenderer.todaysTaskListMenu();

    taskListMenuContainer.appendChild(addTaskButton);
    taskListMenuContainer.appendChild(taskListMenu);

    this.renderCategoryList(categoryList);
    this.renderTodayTaskList(todaysTaskList);

    // if (this.listCount > 2) {
    //   addTaskButtonContainer.classList.add("hidden");
    // } else {
    //   addTaskButtonContainer.classList.remove("hidden");
    // }
  }

  renderCategoryList(container: HTMLUListElement): void {
    this.categoryRenderer.list(container);
  }

  renderTodayTaskList(container: HTMLUListElement): void {
    this.taskRenderer.listToday(container);
  }

  private createAddTaskButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "button button__round main__view--button hidden";
    button.title = "Add new task";
    button.setAttribute("aria-label", "Add new task to list");
    button.dataset.view = "home";
    button.innerHTML = `<span class="material-symbols-outlined"> add </span>`;
    return button;
  }

  private getEl(selector: string): HTMLElement | null {
    if (!this.parentContainer) return null;
    return this.parentContainer.querySelector(selector);
  }

  private getTaskListMenuContainer(): HTMLDivElement | null {
    return this.getEl("#todaysTaskListMenu") as HTMLDivElement;
  }
}
