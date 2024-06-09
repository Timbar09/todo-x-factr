/**
 * @description Selects a theme template
 * @param template string - theme template to select
 * @returns void
 * @example selectThemeTemplate("default")
 */

export const selectThemeTemplate = (template: string): void => {
  const body = document.body;

  body.setAttribute("data-template", template);
  localStorage.setItem("themeTemplate", template);
};

/**
 * @description Get theme template
 * @returns string
 */

export const getThemeTemplate = (): string => {
  const template = localStorage.getItem("themeTemplate");

  if (!template) return "default";

  return template;
};
