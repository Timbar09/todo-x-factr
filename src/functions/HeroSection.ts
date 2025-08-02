import { closeHeroNavPopup } from "./ThemeTemplate";
import { addClass, toggleClass, setSectionFocusStatus, lockFocus } from "./Reusable";

const taskListSection = document.getElementById("appList") as HTMLElement;
const heroNavPopup = document.getElementById("heroNavPopup") as HTMLElement;

export const showTaskListSection = (): void => {
  addClass(taskListSection, "show");

  if (heroNavPopup.classList.contains("open")) {
    closeHeroNavPopup();
  }

  if (taskListSection.classList.contains("show")) {
    setSectionFocusStatus("appList", true);
    lockFocus(taskListSection);
  }
};

export const toggleTaskListSection = (): void => {
  toggleClass(taskListSection, "show");

  if (heroNavPopup.classList.contains("open")) {
    closeHeroNavPopup();
  }

  if (taskListSection.classList.contains("show")) {
    setSectionFocusStatus("appList", true);
    lockFocus(taskListSection);
  } else {
    setSectionFocusStatus("appList", false);
  }
};
