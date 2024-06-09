import { addClass, removeClass } from "./Reusable";

export const openEntryForm = (): void => {
  const entryForm = document.getElementById("itemEntryFormContainer");

  if (!entryForm) return;

  const lockFocus = (): void => {
    if (!entryForm.classList.contains("open")) return;

    const focusableElements = entryForm.querySelectorAll(
      "input, button"
    ) as NodeListOf<HTMLElement>;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const textInput = entryForm.querySelector(
      "input[type='text']"
    ) as HTMLInputElement;

    textInput.focus();

    entryForm.addEventListener("keydown", (event) => {
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

  addClass(entryForm, "open");
  removeClass(entryForm, "close");
  setTimeout(lockFocus, 100);
};

export const closeEntryForm = (): void => {
  const entryForm = document.getElementById("itemEntryFormContainer");

  if (!entryForm) return;

  removeClass(entryForm, "open");
  addClass(entryForm, "close");
};
