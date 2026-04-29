import Controller from "../../../controller/CentralController";

import Task from "../../../model/Task";
import Category from "../../../model/Category";
import Template from "../../../model/Template";

import Colors from "../../template/Colors";
import { DialogData } from "../../form/types";

export class FormHandler {
  private controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
  }

  handleSubmit(view: string, form: HTMLFormElement, data: DialogData): void {
    const id = form.dataset.itemId || "";
    const mode = form.dataset.mode || "create";

    if (!this.hasController(view)) {
      return;
    }

    if (mode === "edit") {
      this.handleUpdate(view, id, data);
    } else {
      this.handleCreate(view, data);
    }
  }

  private handleCreate(view: string, data: DialogData): void {
    switch (view) {
      case "home":
        this.controller.addTask(this.createTaskItem(data));
        break;
      case "tasks":
        this.controller.addTask(this.createTaskItem(data));
        break;
      case "templates":
        this.controller.template.add(this.createTemplateItem(data));
        break;
      case "categories":
        this.controller.category.add(this.createCategoryItem(data));
        break;
      default:
        console.warn(`The "${view}" view does not support form submissions.`);
    }
  }

  private handleUpdate(view: string, id: string, data: DialogData): void {
    switch (view) {
      case "home":
        this.updateTaskItem(id, data);
        break;
      case "tasks":
        this.updateTaskItem(id, data);
        break;
      case "categories":
        this.updateCategoryItem(id, data);
        break;
      case "templates":
        this.updateTemplateItem(id, data);
        break;
      default:
        console.warn(`The "${view}" view does not support form updates.`);
    }
  }

  private hasController(view: string): boolean {
    switch (view) {
      case "home":
        return true;
      case "tasks":
        return true;
      case "templates":
        return true;
      case "categories":
        return true;
      default:
        console.warn(`The "${view}" view does not support form submissions.`);
        return false;
    }
  }

  private createCategoryItem(data: DialogData): Category {
    const { categoryName: name, categoryColor: color } = data;
    return new Category(crypto.randomUUID(), name, color, [], 0); // id, name, color, taskIds, completedTaskCount
  }

  private createTaskItem(data: DialogData): Task {
    const { taskTitle: title, categoryId } = data;
    const id = crypto.randomUUID();

    return new Task(id, title, false, categoryId, new Date(), new Date(), null); // id, title, completed, categoryId, dateCreated, dateUpdated, dateDue
  }

  private createTemplateItem(data: DialogData): Template {
    const { templateName, primaryColor, textColor, bgColor } = data;
    const colors = Colors.createColorScheme(primaryColor, textColor, bgColor);

    return new Template(crypto.randomUUID(), false, templateName, colors); // id, isDefault, name, colors
  }

  private updateTaskItem(id: string, data: DialogData): void {
    const { taskTitle: title, categoryId, dateDue } = data;
    const task = this.controller.task.findById(id);

    if (task) {
      task.title = title;
      task.categoryId = categoryId;
      task.dateDue = dateDue ? new Date(dateDue) : null;
      this.controller.updateTask(task);
    }
  }

  private updateCategoryItem(id: string, data: DialogData): void {
    const { categoryName: name, categoryColor: color } = data;
    const category = this.controller.category.findById(id);

    if (category) {
      category.name = name;
      category.color = color;
      this.controller.category.update(category);
    }
  }

  private updateTemplateItem(id: string, data: DialogData): void {
    const { templateName, primaryColor, textColor, bgColor } = data;
    const colors = Colors.createColorScheme(primaryColor, textColor, bgColor);
    const template = this.controller.template.findById(id);

    if (template) {
      template.name = templateName;
      template.colors = colors;
      this.controller.template.update(template);
    }
  }
}
