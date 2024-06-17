import initApp from "./functions/App";

import "./css/style.css";

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader?.classList.add("hide-loader");
  }, 1500);

  initApp();
});
