import Controller from "../../controller/CentralController";
import CategoryUI from "../category";
import TaskUI from "../task";

export default class HomeRenderer {
  private controller: Controller;
  private categoryRenderer: CategoryUI;
  private taskRenderer: TaskUI;
  private listCount: number = 0;
  private parentContainer: HTMLElement | null = null;

  constructor(controller: Controller) {
    this.controller = controller;
    this.categoryRenderer = new CategoryUI(this.controller);
    this.taskRenderer = new TaskUI();
    this.listCount = this.controller.task.list.length;
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

          <div id="taskListMenu" class="task__list--today__header--more">
            <!-- Task list menu is dynamically rendered here -->
          </div>
        </header>

        <ul id="todaysTaskList" class="task__list">
          <!-- Task items are dynamically rendered here -->
        </ul>
        </div>

        <div class="main__view--button__container">
          <button
            id="openTaskDialogButton"
            class="button button__primary button__primary--round main__entryForm--button main__view--button"
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
    const todaysTaskListHeader = this.getEl("#taskListMenu") as HTMLDivElement;
    const todaysTaskList = this.getEl("#todaysTaskList") as HTMLUListElement;
    const addTaskButtonContainer = this.getAddTaskButtonContainer()!;

    const taskListMenu = this.taskRenderer.todaysTaskListMenu();

    todaysTaskListHeader.appendChild(taskListMenu);

    this.renderCategoryList(categoryList);
    this.renderTodayTaskList(todaysTaskList);

    if (this.listCount > 2) {
      addTaskButtonContainer.style.setProperty("--offset", "0");
    }
  }

  renderCategoryList(container: HTMLUListElement): void {
    this.categoryRenderer.list(container);
  }

  renderTodayTaskList(container: HTMLUListElement): void {
    this.taskRenderer.listToday(container);
  }

  getEl(selector: string): HTMLElement | null {
    if (!this.parentContainer) return null;
    return this.parentContainer.querySelector(selector);
  }

  private getAddTaskButtonContainer(): HTMLDivElement | null {
    return this.getEl(".main__view--button__container") as HTMLDivElement;
  }
}
