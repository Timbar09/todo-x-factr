import { addClass, removeClass, setSectionFocusStatus } from "./Reusable";

const taskListSection = document.getElementById("appList") as HTMLElement;
const heroNavPopup = document.getElementById("heroNavPopup") as HTMLElement;

export const showTaskListSection = (): void => {
  const firstFocusableElement = taskListSection.querySelector("button") as HTMLElement;

  addClass(taskListSection, "show");
  removeClass(heroNavPopup, "open");

  if (taskListSection.classList.contains("show")) {
    setSectionFocusStatus("appList", true);
    firstFocusableElement.focus();
  }
};
