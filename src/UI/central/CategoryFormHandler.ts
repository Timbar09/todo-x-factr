import Controller from "../../controller/CentralController";
import Category from "../../model/Category";
import { FormDataCollection } from "../form/types";

export class CategoryFormHandler {
  private controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
  }

  handleSubmit(
    categoryId: string,
    form: HTMLFormElement,
    formData: FormDataCollection
  ): void {
    if (form?.dataset.mode === "edit") {
      this.handleUpdate(categoryId, formData);
    } else {
      this.handleCreate(formData);
    }
  }

  private handleCreate(formData: FormDataCollection): void {
    const { categoryName, categoryColor } = formData;

    const category = new Category(
      crypto.randomUUID(),
      categoryName,
      categoryColor,
      [],
      0
    );
    this.controller.category.add(category);
  }

  private handleUpdate(itemId: string, formData: FormDataCollection): void {
    const { categoryName, categoryColor } = formData;

    const category = this.controller.category.findById(itemId);
    if (category) {
      category.name = categoryName;
      category.color = categoryColor;
      this.controller.category.update(category);
    }
  }
}
