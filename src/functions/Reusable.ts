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

/**
 * @description Skip a section of the page when tabbing
 * @param sectionId string - id of the section to skip
 * @param enable boolean - enable or disable tabbing
 */

export const toggleFocusableInSection = (sectionId: string, enable: boolean): void => {
  const focusableElements =
    'button, [href], input, select, textarea, ul, img, [tabindex]:not([tabindex="-1"])';
  const section = document.getElementById(sectionId) as HTMLElement;
  const focusable = Array.from(section.querySelectorAll(focusableElements)) as HTMLElement[];

  focusable.forEach((element) => {
    if (enable) {
      element.removeAttribute("tabindex");
      focusable[0].focus();
    } else {
      const heroFirtFocusable = document.getElementById("showList") as HTMLButtonElement;

      element.setAttribute("tabindex", "-1");
      heroFirtFocusable.focus();
    }
  });
};
