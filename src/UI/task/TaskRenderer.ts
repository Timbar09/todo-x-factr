import Task from "../../model/Task";
import Controller from "../../controller/CentralController";
import TaskMenu from "./TaskMenu";

export default class TaskRenderer {
  private controller: Controller;
  private taskMenu: TaskMenu;

  constructor(controller: Controller, taskMenu: TaskMenu) {
    this.controller = controller;
    this.taskMenu = taskMenu;
  }

  renderTaskList(container: HTMLUListElement): void {
    const tasks = this.controller.task.list;

    container.innerHTML = "";

    tasks.forEach(task => {
      const li = this.createTaskElement(task);
      container.appendChild(li);
    });
  }

  createTaskElement(task: Task): HTMLLIElement {
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

    // Add menu to task element
    const moreMenu = this.taskMenu.createTaskMenu(task.id);
    li.appendChild(moreMenu);

    return li;
  }
}
