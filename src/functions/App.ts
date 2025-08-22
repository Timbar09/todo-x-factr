import TaskController from "../controller/TaskController";
import TaskUI from "../UI/TaskUI";

import CategoryController from "../controller/CategoryController";
import CategoryUI from "../UI/CategoryUI";

import TemplateController from "../controller/TemplateController";
import { TemplateUI } from "../UI/TemplateUI";

import MenuController from "../controller/MenuController";

import { showTaskListSection, toggleTaskListSection } from "./HeroSection";
// import { setSectionFocusStatus } from "./Reusable";

const taskController = TaskController.instance;
const categoryController = CategoryController.instance;

// const setDefaultSectionFocusStatuses = (): void => {
//   const taskListSection = document.getElementById(
//     "application"
//   ) as HTMLUListElement;
//   const menu = document.getElementById("menu") as HTMLDivElement;

//   const isTaskListSectionActive = taskListSection.classList.contains("show");
//   const isHeroNavPopupActive = menu.classList.contains("open");

//   if (!isTaskListSectionActive && !isHeroNavPopupActive) {
//     setSectionFocusStatus("application", false);
//     setSectionFocusStatus("menu", false);
//   }
// };

const renderListeners = (): void => {
  const showListSectionButton = document.getElementById(
    "showList"
  ) as HTMLButtonElement;
  const toggleListButton = document.getElementById(
    "toggleTaskListButton"
  ) as HTMLButtonElement;
  // const buttons = document.querySelectorAll(
  //   ".button"
  // ) as NodeListOf<HTMLButtonElement>;

  // buttons.forEach(button => {
  //   button.addEventListener("click", () => {
  //     addClass(button, "clicked");
  //     setTimeout(() => {
  //       removeClass(button, "clicked");
  //     }, 500);
  //   });
  // });

  showListSectionButton.addEventListener("click", () => {
    showTaskListSection();
  });

  toggleListButton.addEventListener("click", () => {
    toggleTaskListSection();
  });
};

export default (): void => {
  categoryController.syncWithTasks(taskController.tasks);

  renderListeners();

  const templateController = new TemplateController();
  new TemplateUI(templateController);
  TaskUI.instance;
  CategoryUI.instance;
  MenuController.getInstance();

  // setDefaultSectionFocusStatuses();
};
