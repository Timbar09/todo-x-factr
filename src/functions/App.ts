import TaskUI from "../UI/TaskUI";
import CategoryUI from "../UI/CategoryUI";
import TemplateUI from "../UI/TemplateUI";

import MenuController from "../controller/MenuController";

import { showTaskListSection, toggleTaskListSection } from "./HeroSection";

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
  renderListeners();

  TemplateUI.instance;
  TaskUI.instance;
  CategoryUI.instance;
  MenuController.getInstance();

  // setDefaultSectionFocusStatuses();
};
