import FullList from "./model/FullList";
import ListItem from "./model/ListItem";
import ListTemplate from "./templates/ListTemplate";
import CategoryList from "./model/CategoryList";
import CategoryItem from "./model/CategoryItem";
import CategorySelectionTemplate from "./templates/CategorySelectionTemplate";
import CategoryListTemplate from "./templates/CategoryListTemplate";
import {
  addClass,
  toggleClass,
  removeClass,
  selectThemeTemplate,
  getThemeTemplate,
} from "./functions/Functions";

import "./css/style.css";

const showListButton = document.getElementById("showList") as HTMLButtonElement;
const toggleListButton = document.getElementById(
  "toggleList"
) as HTMLButtonElement;
const taskList = document.getElementById("appList") as HTMLUListElement;
const taskListMenuButton = document.getElementById(
  "taskMenuButton"
) as HTMLButtonElement;
const taskListMenu = document.getElementById("taskMenuList") as HTMLDivElement;
const taskListMenuItems = document.querySelectorAll(
  ".app__task--menu__item"
) as NodeListOf<HTMLLIElement>;
const heroNavPopup = document.getElementById("heroNavPopup") as HTMLDivElement;
const openHeroNavPopupButton = document.getElementById(
  "openNavPopup"
) as HTMLButtonElement;
const closeHeroNavPopupButton = document.getElementById(
  "closeHeroNavPopup"
) as HTMLButtonElement;
const templateOptions = document.querySelectorAll(
  ".hero__nav--templates__button"
) as NodeListOf<HTMLButtonElement>;
const newTaskInput = document.getElementById("newItem") as HTMLInputElement;
const buttons = document.querySelectorAll(
  ".button"
) as NodeListOf<HTMLButtonElement>;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    addClass(button, "clicked");
    setTimeout(() => {
      removeClass(button, "clicked");
    }, 400);
  });
});

showListButton.addEventListener("click", () => {
  addClass(taskList, "show");
  removeClass(heroNavPopup, "open");
});

toggleListButton.addEventListener("click", () => {
  toggleClass(taskList, "show");
  removeClass(heroNavPopup, "open");
});

newTaskInput.addEventListener("click", () => {
  if (!taskList.classList.contains("show")) {
    addClass(taskList, "show");
    removeClass(heroNavPopup, "open");
  }
});

taskListMenuButton.addEventListener("click", () => {
  toggleClass(taskListMenu, "open");

  taskListMenuItems.forEach((item) => {
    item.addEventListener("click", () => {
      removeClass(taskListMenu, "open");
    });
  });
});

openHeroNavPopupButton.addEventListener("click", () => {
  addClass(heroNavPopup, "open");
});

closeHeroNavPopupButton.addEventListener("click", () => {
  removeClass(heroNavPopup, "open");
});

if (templateOptions.length) {
  templateOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const template = option.getAttribute("data-template");

      if (!template) return;

      selectThemeTemplate(template);
    });
  });
} else {
  console.log("No template options found");
}

const initApp = (): void => {
  const fullList = FullList.instance;
  const categoryList = CategoryList.instance;
  const listTemplate = ListTemplate.instance;
  const categoryOptionsTemplate = CategorySelectionTemplate.instance;
  const categoryListTemplate = CategoryListTemplate.instance;

  const itemEntryForm = document.getElementById(
    "itemEntryForm"
  ) as HTMLFormElement;
  const itemCategorySelection = document.getElementById(
    "categorySelect"
  ) as HTMLSelectElement;
  const categoryColor = document.getElementById(
    "categoryColor"
  ) as HTMLDivElement;

  itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
    e.preventDefault();

    const itemInput = document.getElementById("newItem") as HTMLInputElement;
    const newEntryText: string = itemInput.value.trim();

    const selectedCategory: string = itemCategorySelection.value;
    let updatedCategoryItem: CategoryItem | null = null;

    const itemId: string = crypto.randomUUID();

    if (selectedCategory) {
      const category = categoryList.findCategoryById(selectedCategory);

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

    itemInput.value = "";

    fullList.addItem(newItem);
    listTemplate.render(fullList, categoryList);
  });

  categoryListTemplate.render(categoryList);
  categoryOptionsTemplate.render(categoryList);

  const clearItemsButton = document.getElementById(
    "clearItemsButton"
  ) as HTMLButtonElement;
  const clearCompletedButton = document.getElementById(
    "clearCompletedItemsButton"
  ) as HTMLButtonElement;

  itemCategorySelection.addEventListener("change", () => {
    const selectedOption =
      itemCategorySelection.options[itemCategorySelection.selectedIndex];
    const color: string = selectedOption.getAttribute("data-color") as string;
    console.log(color);
    categoryColor.style.setProperty("--color", color);
  });

  clearItemsButton.addEventListener("click", (): void => {
    fullList.clearList();
    categoryList.categories.forEach((category) => {
      category.clearItems();
    });
    categoryList.save();
    listTemplate.clear();
  });

  clearCompletedButton.addEventListener("click", (): void => {
    fullList.ClearCompleted();
    listTemplate.render(fullList, categoryList);
  });

  fullList.load();
  listTemplate.render(fullList, categoryList);
};

document.addEventListener("DOMContentLoaded", () => {
  const themeTemplate = getThemeTemplate();

  if (themeTemplate) {
    selectThemeTemplate(themeTemplate);
  }

  initApp();
});
