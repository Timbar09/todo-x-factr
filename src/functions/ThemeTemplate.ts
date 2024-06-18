import { addClass, removeClass } from "./Reusable";
import { setSectionFocusStatus } from "./Reusable";
import { lockFocus } from "./Reusable";

/**
 * @description Selects a theme template
 * @returns void
 */

export const setThemeTemplate = (): void => {
  const body = document.body;
  const templateOptions = document.querySelectorAll(
    ".hero__nav--templates__button"
  ) as NodeListOf<HTMLButtonElement>;
  const savedTemplate = localStorage.getItem("themeTemplate");

  const setAttribute = (template: string): void => {
    body.setAttribute("data-template", template);
    localStorage.setItem("themeTemplate", template);
  };

  if (savedTemplate) {
    setAttribute(savedTemplate);
  }

  templateOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const template = option.dataset.template;

      if (!template) return;

      setAttribute(template);
    });
  });
};

export const openHeroNavPopup = (): void => {
  const heroNavPopup = document.getElementById("heroNavPopup") as HTMLDivElement;

  addClass(heroNavPopup, "open");

  if (heroNavPopup.classList.contains("open")) {
    setSectionFocusStatus("heroNavPopup", true);
    lockFocus(heroNavPopup);
  }
};

export const closeHeroNavPopup = (): void => {
  const heroNavPopup = document.getElementById("heroNavPopup") as HTMLDivElement;

  removeClass(heroNavPopup, "open");

  if (!heroNavPopup.classList.contains("open")) {
    setSectionFocusStatus("heroNavPopup", false);
  }
};
