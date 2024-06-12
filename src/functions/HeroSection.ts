import { addClass, removeClass, setSectionFocusStatus, lockFocus } from "./Reusable";

const taskListSection = document.getElementById("appList") as HTMLElement;
const heroNavPopup = document.getElementById("heroNavPopup") as HTMLElement;

export const showTaskListSection = (): void => {
  addClass(taskListSection, "show");
  removeClass(heroNavPopup, "open");

  if (taskListSection.classList.contains("show")) {
    setSectionFocusStatus("appList", true);
    lockFocus(taskListSection);
  }
};
