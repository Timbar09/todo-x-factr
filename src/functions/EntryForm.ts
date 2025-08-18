import taskController from "../controller/TaskController";
// import ListTemplate from "../templates/ListTemplate";
import Task from "../model/Task";
import CategoryItem from "../model/Category";
import CategoryController from "../controller/CategoryController";

import { addClass, removeClass, lockFocus } from "./Reusable";
import { showTaskListSection } from "./HeroSection";

export const handleFormSubmit = (e: SubmitEvent): void => {
  e.preventDefault();

  const TaskController = taskController.instance;
  const categoryController = CategoryController.instance;
  // const listTemplate = ListTemplate.instance;

  const categorySelectionBox = document.getElementById(
    "categoryButton"
  ) as HTMLButtonElement;
  const newTaskInput = document.getElementById("newTask") as HTMLInputElement;
  const newTaskInputValue: string = newTaskInput.value.trim();

  const selectedCategory = categorySelectionBox.children[0].textContent;
  let updatedCategoryItem: CategoryItem | null = null;

  const itemId: string = crypto.randomUUID();

  if (selectedCategory && selectedCategory !== "Select category") {
    const category = categoryController.findCategoryByName(selectedCategory);

    if (!category) {
      return console.error("Category not found");
    }

    updatedCategoryItem = category;

    updatedCategoryItem.addTask(itemId);
    // categoryController.updateCategory(updatedCategoryItem);
  }

  if (!newTaskInputValue.length) return;

  const newTask = new Task(
    itemId,
    newTaskInputValue,
    false,
    updatedCategoryItem?.id
  );
  const categoryColor = document.getElementById(
    "categoryColor"
  ) as HTMLDivElement;

  newTaskInput.value = "";
  categorySelectionBox.children[0].textContent = "Select category";
  categoryColor.style.setProperty("--color", "var(--text-300)");

  TaskController.addTask(newTask);
  // listTemplate.render(TaskController, categoryController);
  closeEntryForm();
};

export const openEntryForm = (): void => {
  const entryForm = document.getElementById("itemEntryFormContainer");

  if (!entryForm) return;

  addClass(entryForm, "open");
  removeClass(entryForm, "closed");

  setTimeout(() => {
    lockFocus(entryForm, 2);
  }, 100);
};

export const closeEntryForm = (): void => {
  const entryForm = document.getElementById("itemEntryFormContainer");

  if (!entryForm) return;

  removeClass(entryForm, "open");
  addClass(entryForm, "closed");

  showTaskListSection();
};
