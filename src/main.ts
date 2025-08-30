import CentralUI from "./UI/central";
import TaskUI from "./UI/task";
import CategoryUI from "./UI/category";
import TemplateUI from "./UI/template";

// import MenuController from "./controller/MenuController";

export default (): void => {};

import "./css/main.css";

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader?.classList.add("hide-loader");
  }, 2000);

  CentralUI.instance;
  TemplateUI.instance;
  TaskUI.instance;
  CategoryUI.instance;
  // MenuController.getInstance();
});
