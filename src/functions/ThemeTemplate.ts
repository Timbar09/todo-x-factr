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
    ".template__button"
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

/**
 * @description Opens the hero navigation popup
 * @returns void
 */

export const openHeroNavPopup = (): void => {
  const menu = document.getElementById("menu") as HTMLDivElement;

  removeClass(menu, "close");
  addClass(menu, "open");

  if (menu.classList.contains("open")) {
    setSectionFocusStatus("menu", true);
    lockFocus(menu);
  }
};

/**
 * @description Closes the hero navigation popup
 * @returns void
 */

export const closeMenu = (): void => {
  const menu = document.getElementById("menu") as HTMLDivElement;

  removeClass(menu, "open");
  addClass(menu, "close");

  if (menu.classList.contains("close")) {
    setSectionFocusStatus("menu", false);
  }
};
