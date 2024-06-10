import FullList from "../model/FullList";
import ListTemplate from "../templates/ListTemplate";
import CategoryList from "../model/CategoryList";
import CategorySelectionTemplate from "../templates/CategorySelectionTemplate";
import CategoryListTemplate from "../templates/CategoryListTemplate";

import { handleFormSubmit } from "./EntryForm";

export default (): void => {
  const fullList = FullList.instance;
  const categoryList = CategoryList.instance;
  const listTemplate = ListTemplate.instance;
  const categoryOptionsTemplate = CategorySelectionTemplate.instance;
  const categoryListTemplate = CategoryListTemplate.instance;

  categoryListTemplate.render(categoryList);
  categoryOptionsTemplate.render(categoryList);

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
    categoryList.categories.forEach((category) => {
      category.clearItems();
      categoryList.updateCategory(category);
    });
    listTemplate.clear();
  });

  clearCompletedButton.addEventListener("click", (): void => {
    categoryList.categories.forEach((category) => {
      fullList.list.forEach((item) => {
        if (item.checked) {
          category.removeItem(item.id);
        }
      });
      categoryList.updateCategory(category);
    });
    fullList.ClearCompleted();
    listTemplate.render(fullList, categoryList);
  });

  fullList.load();
  listTemplate.render(fullList, categoryList);
};
