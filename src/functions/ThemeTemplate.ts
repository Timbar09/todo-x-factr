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
    ".templates__button"
  ) as NodeListOf<HTMLButtonElement>;
  const savedTemplate = localStorage.getItem("themeTemplate");

  const setTheme = (template: string): void => {
    body.setAttribute("data-template", template);
    localStorage.setItem("themeTemplate", template);

    templateOptions.forEach((option) => {
      removeClass(option, "active");
    });

    const selectedOptions = body.querySelectorAll(
      `[data-template="${template}"]`
    ) as NodeListOf<HTMLButtonElement>;

    selectedOptions.forEach((option) => {
      addClass(option, "active");
    });
  };

  if (savedTemplate) {
    setTheme(savedTemplate);
  }

  templateOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const template = option.dataset.template;

      if (!template) return;

      setTheme(template);
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
