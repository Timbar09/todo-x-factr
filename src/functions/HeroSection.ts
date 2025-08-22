import MenuController from "../controller/MenuController";
import {
  addClass,
  toggleClass,
  setSectionFocusStatus,
  lockFocus,
} from "./Reusable";

const taskListSection = document.getElementById("application") as HTMLElement;
const menu = MenuController.getInstance();

export const showTaskListSection = (): void => {
  addClass(taskListSection, "show");

  if (menu.isMenuOpen) {
    menu.close();
  }

  if (taskListSection.classList.contains("show")) {
    setSectionFocusStatus("application", true);
    lockFocus(taskListSection);
  }
};

export const toggleTaskListSection = (): void => {
  toggleClass(taskListSection, "show");

  if (menu.isMenuOpen) {
    menu.close();
  }

  if (taskListSection.classList.contains("show")) {
    setSectionFocusStatus("application", true);
    lockFocus(taskListSection);
  } else {
    setSectionFocusStatus("application", false);
  }
};
