import CentralUI from "./UI/central";
// import MenuController from "./controller/MenuController";

// export default (): void => {};

import "./css/index.css";

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader?.classList.add("hide-loader");
  }, 2000);

  CentralUI.instance;
  // MenuController.getInstance();
});
