import FullList from "../model/FullList";
import ListTemplate from "../templates/ListTemplate";
import CategoryList from "../model/CategoryList";
import CategorySelectionTemplate from "../templates/CategorySelectionTemplate";
import CategoryListTemplate from "../templates/CategoryListTemplate";

import { setSectionFocusStatus } from "./Reusable";
import { handleFormSubmit } from "./EntryForm";
import { setThemeTemplate } from "./ThemeTemplate";
import { showTaskListSection, toggleTaskListSection } from "./HeroSection";
import { openHeroNavPopup, closeHeroNavPopup } from "./ThemeTemplate";
import { openEntryForm, closeEntryForm } from "./EntryForm";
import { addClass, removeClass, toggleMoreOptionsMenu } from "./Reusable";

const fullList = FullList.instance;
const categoryList = CategoryList.instance;
const listTemplate = ListTemplate.instance;
const categorySelectionTemplate = CategorySelectionTemplate.instance;
const categoryListTemplate = CategoryListTemplate.instance;

const setDefaultSectionFocusStatuses = (): void => {
  const taskListSection = document.getElementById("appList") as HTMLUListElement;
  const heroNavPopup = document.getElementById("heroNavPopup") as HTMLDivElement;

  const isTaskListSectionActive = taskListSection.classList.contains("show");
  const isHeroNavPopupActive = heroNavPopup.classList.contains("open");

  if (!isTaskListSectionActive && !isHeroNavPopupActive) {
    setSectionFocusStatus("appList", false);
    setSectionFocusStatus("heroNavPopup", false);
  }
};

const renderListeners = (): void => {
  const showListSectionButton = document.getElementById("showList") as HTMLButtonElement;
  const toggleListButton = document.getElementById("toggleList") as HTMLButtonElement;
  const moreOptionsButton = document.querySelectorAll(
    ".more__options--button"
  ) as NodeListOf<HTMLButtonElement>;
  const openHeroNavPopupButton = document.getElementById("openNavPopup") as HTMLButtonElement;
  const closeHeroNavPopupButton = document.getElementById("closeHeroNavPopup") as HTMLButtonElement;
  const buttons = document.querySelectorAll(".button") as NodeListOf<HTMLButtonElement>;
  const showItemEntryFormButton = document.getElementById("showItemEntryForm") as HTMLButtonElement;
  const closeItemEntryFormButton = document.getElementById(
    "closeItemEntryForm"
  ) as HTMLButtonElement;
  const itemEntryForm = document.getElementById("itemEntryForm") as HTMLFormElement;
  const clearItemsButton = document.getElementById("clearItemsButton") as HTMLButtonElement;
  const clearCompletedButton = document.getElementById(
    "clearCompletedItemsButton"
  ) as HTMLButtonElement;

  itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
    handleFormSubmit(e);
  });

  clearItemsButton.addEventListener("click", (): void => {
    fullList.clearList();
    categoryList.clearCategoryItems();
    listTemplate.clear();
  });

  clearCompletedButton.addEventListener("click", (): void => {
    categoryList.clearCompletedCategoryItems(fullList);
    fullList.ClearCompleted();
    listTemplate.render(fullList, categoryList);
  });

  buttons.forEach((button) => {
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

  moreOptionsButton.forEach((button) => {
    button.addEventListener("click", () => {
      toggleMoreOptionsMenu(button);
    });
  });

  // taskListMenuButton.addEventListener("click", () => {
  //   toggleTaskListMenu();
  // });

  openHeroNavPopupButton.addEventListener("click", () => {
    openHeroNavPopup();
  });

  closeHeroNavPopupButton.addEventListener("click", () => {
    closeHeroNavPopup();
  });

  showItemEntryFormButton.addEventListener("click", () => {
    openEntryForm();
  });

  closeItemEntryFormButton.addEventListener("click", () => {
    closeEntryForm();
  });
};

export default (): void => {
  categoryListTemplate.render(categoryList);
  categorySelectionTemplate.render(categoryList);

  renderListeners();

  fullList.load();
  listTemplate.render(fullList, categoryList);

  setThemeTemplate();

  setDefaultSectionFocusStatuses();
};
