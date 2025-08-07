import MenuController from "../controller/MenuController";
import {
  addClass,
  toggleClass,
  setSectionFocusStatus,
  lockFocus,
} from "./Reusable";

const taskListSection = document.getElementById("appList") as HTMLElement;
const menu = MenuController.getInstance();

export const showTaskListSection = (): void => {
  addClass(taskListSection, "show");

  if (menu.isMenuOpen) {
    menu.close();
  }

  if (taskListSection.classList.contains("show")) {
    setSectionFocusStatus("appList", true);
    lockFocus(taskListSection);
  }
};

export const toggleTaskListSection = (): void => {
  toggleClass(taskListSection, "show");

  if (menu.isMenuOpen) {
    menu.close();
  }

  if (taskListSection.classList.contains("show")) {
    setSectionFocusStatus("appList", true);
    lockFocus(taskListSection);
  } else {
    setSectionFocusStatus("appList", false);
  }
};
