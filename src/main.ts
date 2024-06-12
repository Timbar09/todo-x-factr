import initApp from "./functions/App";
import { openEntryForm, closeEntryForm } from "./functions/EntryForm";
import { addClass, toggleClass, removeClass } from "./functions/Reusable";
import { showTaskListSection } from "./functions/HeroSection";

import "./css/style.css";

const showListSectionButton = document.getElementById("showList") as HTMLButtonElement;
const toggleListButton = document.getElementById("toggleList") as HTMLButtonElement;
const taskListSection = document.getElementById("appList") as HTMLUListElement;
const taskListMenuButton = document.getElementById("taskMenuButton") as HTMLButtonElement;
const taskListMenu = document.getElementById("taskMenuList") as HTMLDivElement;
const taskListMenuItems = document.querySelectorAll(
  ".app__task--menu__item"
) as NodeListOf<HTMLLIElement>;
const heroNavPopup = document.getElementById("heroNavPopup") as HTMLDivElement;
const openHeroNavPopupButton = document.getElementById("openNavPopup") as HTMLButtonElement;
const closeHeroNavPopupButton = document.getElementById("closeHeroNavPopup") as HTMLButtonElement;
const newTaskInput = document.getElementById("newItem") as HTMLInputElement;
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
  toggleClass(taskListSection, "show");
  removeClass(heroNavPopup, "open");

  // if (taskListSection.classList.contains("show")) {
  //   toggleFocusableInSection("appList", true);
  // } else {
  //   toggleFocusableInSection("appList", false);
  // }
});

newTaskInput.addEventListener("click", () => {
  if (!taskListSection.classList.contains("show")) {
    addClass(taskListSection, "show");
    removeClass(heroNavPopup, "open");

    // if (taskListSection.classList.contains("show")) {
    //   toggleFocusableInSection("appList", true);
    // }
  }
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
  addClass(heroNavPopup, "open");

  // if (heroNavPopup.classList.contains("open")) {
  //   toggleFocusableInSection("heroNavPopup", true);
  // }
});

closeHeroNavPopupButton.addEventListener("click", () => {
  removeClass(heroNavPopup, "open");

  // if (!heroNavPopup.classList.contains("open")) {
  //   toggleFocusableInSection("heroNavPopup", false);
  // }
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
