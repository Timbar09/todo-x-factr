import FullList from "../model/FullList";
import ListTemplate from "../templates/ListTemplate";
import ListItem from "../model/ListItem";
import CategoryItem from "../model/CategoryItem";
import CategoryList from "../model/CategoryList";

import { addClass, removeClass, lockFocus } from "./Reusable";
import { showTaskListSection } from "./HeroSection";

export const handleFormSubmit = (e: SubmitEvent): void => {
  e.preventDefault();

  const fullList = FullList.instance;
  const categoryList = CategoryList.instance;
  const listTemplate = ListTemplate.instance;

  const categorySelectionBox = document.getElementById(
    "categoryButton"
  ) as HTMLButtonElement;
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

  const newItem = new ListItem(
    itemId,
    newEntryText,
    false,
    updatedCategoryItem?.id
  );
  const categoryColor = document.getElementById(
    "categoryColor"
  ) as HTMLDivElement;

  itemInput.value = "";
  categorySelectionBox.children[0].textContent = "Select category";
  categoryColor.style.setProperty("--color", "var(--text-300)");

  fullList.addItem(newItem);
  listTemplate.render(fullList, categoryList);
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
