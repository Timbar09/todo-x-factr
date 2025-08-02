import initApp from "./functions/App";

import "./css/main.css";

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader?.classList.add("hide-loader");
  }, 2000);

  initApp();
});
