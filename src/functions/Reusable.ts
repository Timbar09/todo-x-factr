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

export const setSectionFocusStatus = (sectionId: string, enable: boolean): void => {
  const focusableElements =
    'button, [href], input, select, textarea, ul, [tabindex]:not([tabindex="-1"])';
  const section = document.getElementById(sectionId) as HTMLElement;
  const focusable = Array.from(section.querySelectorAll(focusableElements)) as HTMLElement[];

  focusable.forEach((element) => {
    if (enable) {
      element.setAttribute("tabindex", "0");
    } else {
      element.setAttribute("tabindex", "-1");
    }
  });
};

/**
 * @description Lock focus within a section
 * @param section HTMLElement - section to lock focus within
 * @param firstFocusablePosition number - position of first focusable element
 */

export const lockFocus = (
  section: HTMLElement,
  firstFocusablePosition: number | null = null
): void => {
  if (!section) return;

  const focusableElements = section.querySelectorAll(
    "button, [href], input, select, ul, textarea, [tabindex]:not([tabindex='-1'])"
  ) as NodeListOf<HTMLElement>;
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  firstFocusablePosition
    ? focusableElements[firstFocusablePosition - 1].focus()
    : firstElement.focus();

  section.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else if (event.key === "Tab") {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
};
