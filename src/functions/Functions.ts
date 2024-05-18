/**
 * @description Add class to element
 * @param element HTMLElement - element to add class to
 * @param className string - class name to add
 */

export const addClass = (element: HTMLElement, className: string): void => {
  if (!element) return;

  element.classList.add(className);
};

/**
 * @description Remove class from element
 * @param element HTMLElement - element to remove class from
 * @param className string - class name to remove
 */

export const removeClass = (element: HTMLElement, className: string): void => {
  if (!element) return;

  element.classList.remove(className);
};

/**
 * @description Toggle class on element
 * @param element HTMLElement - element to toggle class on
 * @param className string - class name to toggle
 */

export const toggleClass = (element: HTMLElement, className: string): void => {
  if (!element) return;

  element.classList.toggle(className);
};

export const selectThemeTemplate = (template: string): void => {
  const body = document.body;

  body.setAttribute("data-template", template);
  localStorage.setItem("themeTemplate", template);
};

export const getThemeTemplate = (): string => {
  const template = localStorage.getItem("themeTemplate");

  if (!template) return "default";

  return template;
};
