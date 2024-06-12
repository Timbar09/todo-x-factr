import FullList from "../model/FullList";
import ListTemplate from "../templates/ListTemplate";
import CategoryList from "../model/CategoryList";
import CategorySelectionTemplate from "../templates/CategorySelectionTemplate";
import CategoryListTemplate from "../templates/CategoryListTemplate";

import { setSectionFocusStatus } from "./Reusable";
import { handleFormSubmit } from "./EntryForm";
import { setThemeTemplate } from "./ThemeTemplate";

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

export default (): void => {
  const fullList = FullList.instance;
  const categoryList = CategoryList.instance;
  const listTemplate = ListTemplate.instance;
  const categorySelectionTemplate = CategorySelectionTemplate.instance;
  const categoryListTemplate = CategoryListTemplate.instance;

  categoryListTemplate.render(categoryList);
  categorySelectionTemplate.render(categoryList);

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

  fullList.load();
  listTemplate.render(fullList, categoryList);

  setThemeTemplate();

  setDefaultSectionFocusStatuses();
};
