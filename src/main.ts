import FullList from "./model/FullList";
import ListItem from "./model/ListItem";
import ListTemplate from "./templates/ListTemplate";
import {
  addClass,
  toggleClass,
  removeClass,
  selectThemeTemplate,
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

console.log("taskListMenuItems", taskListMenuItems);

showListButton.addEventListener("click", () => {
  addClass(taskList, "show");
  removeClass(heroNavPopup, "open");
});

toggleListButton.addEventListener("click", () => {
  toggleClass(taskList, "show");
  removeClass(heroNavPopup, "open");
});

taskListMenuButton.addEventListener("click", () => {
  toggleClass(taskListMenu, "open");

  taskListMenuItems.forEach((item) => {
    item.addEventListener("click", () => {
      console.log("clicked task list menu item");
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

selectThemeTemplate("light");

const initApp = (): void => {
  const fullList = FullList.instance;
  const listTemplate = ListTemplate.instance;

  const itemEntryForm = document.getElementById(
    "itemEntryForm"
  ) as HTMLFormElement;

  itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
    e.preventDefault();

    const itemInput = document.getElementById("newItem") as HTMLInputElement;
    const newEntryText: string = itemInput.value.trim();

    if (!newEntryText.length) return;

    const itemId: number = fullList.list.length
      ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
      : 1;

    const newItem = new ListItem(itemId.toString(), newEntryText);

    itemInput.value = "";

    fullList.addItem(newItem);
    listTemplate.render(fullList);
  });

  const clearItemsButton = document.getElementById(
    "clearItemsButton"
  ) as HTMLButtonElement;

  clearItemsButton.addEventListener("click", (): void => {
    fullList.clearList();
    listTemplate.clear();
  });

  fullList.load();
  listTemplate.render(fullList);
};

document.addEventListener("DOMContentLoaded", initApp);
