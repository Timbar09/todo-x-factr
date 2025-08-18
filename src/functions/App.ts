import TaskController from "../controller/TaskController";
import TaskUI from "../UI/TaskUI";

import CategoryController from "../controller/CategoryController";
import CategoryUI from "../UI/CategoryUI";
import CategorySelectionTemplate from "../templates/CategorySelectionTemplate";

import TemplateController from "../controller/TemplateController";
import { TemplateUI } from "../UI/TemplateUI";

import MenuController from "../controller/MenuController";

import { showTaskListSection, toggleTaskListSection } from "./HeroSection";
import { handleFormSubmit } from "./EntryForm";
import { openEntryForm, closeEntryForm } from "./EntryForm";
import { setSectionFocusStatus } from "./Reusable";
import { addClass, removeClass } from "./Reusable";

const taskController = TaskController.instance;
const categoryController = CategoryController.instance;
const taskUI = TaskUI.instance;
const categorySelectionTemplate = CategorySelectionTemplate.instance;

const setDefaultSectionFocusStatuses = (): void => {
  const taskListSection = document.getElementById(
    "appList"
  ) as HTMLUListElement;
  const menu = document.getElementById("menu") as HTMLDivElement;

  const isTaskListSectionActive = taskListSection.classList.contains("show");
  const isHeroNavPopupActive = menu.classList.contains("open");

  if (!isTaskListSectionActive && !isHeroNavPopupActive) {
    setSectionFocusStatus("appList", false);
    setSectionFocusStatus("menu", false);
  }
};

const renderListeners = (): void => {
  const showListSectionButton = document.getElementById(
    "showList"
  ) as HTMLButtonElement;
  const toggleListButton = document.getElementById(
    "toggleTaskListButton"
  ) as HTMLButtonElement;
  const buttons = document.querySelectorAll(
    ".button"
  ) as NodeListOf<HTMLButtonElement>;
  const showItemEntryFormButton = document.getElementById(
    "showItemEntryForm"
  ) as HTMLButtonElement;
  const closeItemEntryFormButton = document.getElementById(
    "closeItemEntryForm"
  ) as HTMLButtonElement;
  const itemEntryForm = document.getElementById(
    "itemEntryForm"
  ) as HTMLFormElement;

  itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
    handleFormSubmit(e);
    taskUI.render();
  });

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      addClass(button, "clicked");
      setTimeout(() => {
        removeClass(button, "clicked");
      }, 500);
    });
  });

  showListSectionButton.addEventListener("click", () => {
    showTaskListSection();
  });

  toggleListButton.addEventListener("click", () => {
    toggleTaskListSection();
  });

  showItemEntryFormButton.addEventListener("click", () => {
    openEntryForm();
  });

  closeItemEntryFormButton.addEventListener("click", () => {
    closeEntryForm();
  });
};

export default (): void => {
  categoryController.syncWithTasks(taskController.tasks);
  categorySelectionTemplate.render(categoryController);

  renderListeners();

  const templateController = new TemplateController();
  new TemplateUI(templateController);
  // TaskUI.instance;
  CategoryUI.instance;
  MenuController.getInstance();

  setDefaultSectionFocusStatuses();
};
