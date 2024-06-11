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

/**
 * @description Get theme template
 * @returns string
 */

// export const getThemeTemplate = (): string => {
//   const template = localStorage.getItem("themeTemplate");

//   if (!template) return "default";

//   return template;
// };
