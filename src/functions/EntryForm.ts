import FullList from "../model/FullList";
import ListTemplate from "../templates/ListTemplate";
import ListItem from "../model/ListItem";
import CategoryItem from "../model/CategoryItem";
import CategoryList from "../model/CategoryList";

import { addClass, removeClass } from "./Reusable";

export const handleFormSubmit = (e: SubmitEvent): void => {
  e.preventDefault();

  const fullList = FullList.instance;
  const categoryList = CategoryList.instance;
  const listTemplate = ListTemplate.instance;

  const categorySelectionBox = document.getElementById("categoryButton") as HTMLButtonElement;
  const itemInput = document.getElementById("newItem") as HTMLInputElement;
  const newEntryText: string = itemInput.value.trim();

  const selectedCategory = categorySelectionBox.children[0].textContent;
  let updatedCategoryItem: CategoryItem | null = null;

  const itemId: string = crypto.randomUUID();

  if (selectedCategory && selectedCategory !== "Select category") {
    const category = categoryList.findCategoryByName(selectedCategory);

    if (!category) {
      return console.error("Category not found");
    }

    updatedCategoryItem = category;

    updatedCategoryItem.addItem(itemId);
    categoryList.updateCategory(updatedCategoryItem);
  }

  if (!newEntryText.length) return;

  const newItem = new ListItem(itemId, newEntryText, false, updatedCategoryItem?.id);

  itemInput.value = "";

  fullList.addItem(newItem);
  listTemplate.render(fullList, categoryList);
  closeEntryForm();
};

export const openEntryForm = (): void => {
  const entryForm = document.getElementById("itemEntryFormContainer");

  if (!entryForm) return;

  const lockFocus = (): void => {
    if (!entryForm.classList.contains("open")) return;

    const focusableElements = entryForm.querySelectorAll(
      "input, button"
    ) as NodeListOf<HTMLElement>;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const textInput = entryForm.querySelector("input[type='text']") as HTMLInputElement;

    textInput.focus();

    entryForm.addEventListener("keydown", (event) => {
      if (event.key === "Tab" && event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (event.key === "Tab") {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    });
  };

  addClass(entryForm, "open");
  removeClass(entryForm, "close");
  setTimeout(lockFocus, 100);
};

export const closeEntryForm = (): void => {
  const entryForm = document.getElementById("itemEntryFormContainer");

  if (!entryForm) return;

  removeClass(entryForm, "open");
  addClass(entryForm, "close");
};
