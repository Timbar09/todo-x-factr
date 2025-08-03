import { closeMenu } from "./ThemeTemplate";
import { addClass, toggleClass, setSectionFocusStatus, lockFocus } from "./Reusable";

const taskListSection = document.getElementById("appList") as HTMLElement;
const menu = document.getElementById("menu") as HTMLElement;

export const showTaskListSection = (): void => {
  addClass(taskListSection, "show");

  if (menu.classList.contains("open")) {
    closeMenu();
  }

  if (taskListSection.classList.contains("show")) {
    setSectionFocusStatus("appList", true);
    lockFocus(taskListSection);
  }
};

export const toggleTaskListSection = (): void => {
  toggleClass(taskListSection, "show");

  if (menu.classList.contains("open")) {
    closeMenu();
  }

  if (taskListSection.classList.contains("show")) {
    setSectionFocusStatus("appList", true);
    lockFocus(taskListSection);
  } else {
    setSectionFocusStatus("appList", false);
  }
};
