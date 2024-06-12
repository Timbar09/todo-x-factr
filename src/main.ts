import initApp from "./functions/App";
import { openEntryForm, closeEntryForm } from "./functions/EntryForm";
import { addClass, toggleClass, removeClass } from "./functions/Reusable";
import { showTaskListSection, toggleTaskListSection } from "./functions/HeroSection";
import { openHeroNavPopup, closeHeroNavPopup } from "./functions/ThemeTemplate";

import "./css/style.css";

const showListSectionButton = document.getElementById("showList") as HTMLButtonElement;
const toggleListButton = document.getElementById("toggleList") as HTMLButtonElement;
const taskListMenuButton = document.getElementById("taskMenuButton") as HTMLButtonElement;
const taskListMenu = document.getElementById("taskMenuList") as HTMLDivElement;
const taskListMenuItems = document.querySelectorAll(
  ".app__task--menu__item"
) as NodeListOf<HTMLLIElement>;
const openHeroNavPopupButton = document.getElementById("openNavPopup") as HTMLButtonElement;
const closeHeroNavPopupButton = document.getElementById("closeHeroNavPopup") as HTMLButtonElement;
const buttons = document.querySelectorAll(".button") as NodeListOf<HTMLButtonElement>;
const showItemEntryFormButton = document.getElementById("showItemEntryForm") as HTMLButtonElement;
const closeItemEntryFormButton = document.getElementById("closeItemEntryForm") as HTMLButtonElement;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    addClass(button, "clicked");
    setTimeout(() => {
      removeClass(button, "clicked");
    }, 400);
  });
});

showListSectionButton.addEventListener("click", () => {
  showTaskListSection();
});

toggleListButton.addEventListener("click", () => {
  toggleTaskListSection();
});

taskListMenuButton.addEventListener("click", () => {
  toggleClass(taskListMenu, "open");

  taskListMenuItems.forEach((item) => {
    item.addEventListener("click", () => {
      removeClass(taskListMenu, "open");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.closest("#taskMenuButton")) return;

    removeClass(taskListMenu, "open");
  });
});

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

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

document.addEventListener(
  "focus",
  function (event) {
    console.log(event.target);
  },
  true
); // Use capture to catch the event as it bubbles up.
