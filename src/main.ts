import FullList from "./model/FullList";
import ListItem from "./model/ListItem";
import ListTemplate from "./templates/ListTemplate";
import { addClass, toggleClass, removeClass } from "./functions/Functions";

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

console.log("taskListMenuItems", taskListMenuItems);

showListButton.addEventListener("click", () => {
  addClass(taskList, "show");
});

toggleListButton.addEventListener("click", () => {
  toggleClass(taskList, "show");
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
