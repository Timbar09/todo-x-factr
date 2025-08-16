import FullList from "../model/FullList";
import ListTemplate from "../templates/ListTemplate";
import CategoryController from "../controller/CategoryController";
import CategorySelectionTemplate from "../templates/CategorySelectionTemplate";

import { setSectionFocusStatus } from "./Reusable";
import { handleFormSubmit } from "./EntryForm";
import TemplateController from "../controller/TemplateController";
import { TemplateUI } from "../UI/TemplateUI";
import { showTaskListSection, toggleTaskListSection } from "./HeroSection";
import MenuController from "../controller/MenuController";
import { openEntryForm, closeEntryForm } from "./EntryForm";
import { addClass, removeClass } from "./Reusable";

const fullList = FullList.instance;
const categoryController = CategoryController.instance;
const listTemplate = ListTemplate.instance;
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
  const clearItemsButton = document.getElementById(
    "clearItemsButton"
  ) as HTMLButtonElement;
  const clearCompletedButton = document.getElementById(
    "clearCompletedItemsButton"
  ) as HTMLButtonElement;

  itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
    handleFormSubmit(e);
  });

  clearItemsButton.addEventListener("click", (): void => {
    fullList.clearList();
    // categoryList.clearCategoryItems();
    listTemplate.clear();
  });

  clearCompletedButton.addEventListener("click", (): void => {
    // categoryList.clearCompletedCategoryItems(fullList);
    fullList.clearCompleted();
    listTemplate.render(fullList, categoryController);
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
  fullList.load();
  categoryController.syncWithTasks(fullList.list);
  categorySelectionTemplate.render(categoryController);

  renderListeners();

  const templateController = new TemplateController();
  listTemplate.render(fullList, categoryController);
  new TemplateUI(templateController);
  MenuController.getInstance();

  setDefaultSectionFocusStatuses();
};
