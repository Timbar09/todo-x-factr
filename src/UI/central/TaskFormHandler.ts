import Controller from "../../controller/CentralController";
import Task from "../../model/Task";
import { FormDataCollection } from "../form/types";

export class TaskFormHandler {
  private controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
  }

  handleSubmit(
    taskId: string,
    form: HTMLFormElement,
    formData: FormDataCollection
  ): void {
    if (form?.dataset.mode === "edit") {
      this.handleUpdate(taskId, formData);
    } else {
      this.handleCreate(formData);
    }
  }

  private handleCreate(formData: FormDataCollection): void {
    const { taskTitle, categoryId } = formData;

    const task = new Task(crypto.randomUUID(), taskTitle, false, categoryId);
    this.controller.addTask(task);
  }

  private handleUpdate(itemId: string, formData: FormDataCollection): void {
    const { taskTitle, categoryId } = formData;

    const task = this.controller.task.findById(itemId);
    if (task) {
      task.title = taskTitle;
      task.categoryId = categoryId;
      this.controller.updateTask(task);
    }
  }
}
