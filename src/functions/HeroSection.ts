import { closeHeroNavPopup } from "./ThemeTemplate";
import { addClass, removeClass, toggleClass, setSectionFocusStatus, lockFocus } from "./Reusable";

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

export const toggleTaskListMenu = (): void => {
  const taskListMenu = document.getElementById("taskMenuList") as HTMLDivElement;
  const taskListMenuItems = document.querySelectorAll(
    ".app__task--menu__item"
  ) as NodeListOf<HTMLLIElement>;

  toggleClass(taskListMenu, "open");

  lockFocus(taskListMenu);

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
};
