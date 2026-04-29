import { ViewType } from "../types";

export default class FormDialogDom {
  static getAppEl(): HTMLElement | null {
    return document.querySelector("#app");
  }

  static getToggleDialogButtonEl(dialog: HTMLElement): HTMLElement | null {
    return dialog.querySelector("#toggleDialogButton");
  }

  static getDialogContainerEl(main: HTMLElement): HTMLElement | null {
    return main.querySelector("#dialogContainer");
  }

  static getDialogEl(dialog: HTMLElement): HTMLElement | null {
    return dialog.querySelector(".dialog");
  }

  static getDialogContentEl(dialog: HTMLElement): HTMLElement | null {
    return dialog.querySelector(".dialog__content");
  }

  static getFormEl(dialog: HTMLElement): HTMLFormElement | null {
    return dialog.querySelector(".form");
  }

  static setDialogStyle(dialog: HTMLElement, view: ViewType): void {
    dialog.classList.remove("dialog__none", "dialog__home", "dialog__default");

    switch (view) {
      case "home":
        dialog.classList.add("dialog__home");
        break;
      case "analytics":
        dialog.classList.add("dialog__none");
        break;
      default:
        dialog.classList.add("dialog__default");
    }
  }

  static dragUp(dialog: HTMLElement, dialogElement: HTMLElement): void {
    if (dialog.classList.contains("dialog__home")) {
      dialog.classList.add("open");
      dialog.classList.remove("closed", "hidden");
    } else {
      dialog.classList.remove("hidden", "closed", "open");
    }

    dialogElement.removeAttribute("inert");
  }

  static dragDown(dialog: HTMLElement, dialogElement: HTMLElement): void {
    if (dialog.classList.contains("dialog__home")) {
      dialog.classList.remove("open", "hidden");
      dialog.classList.add("closed");
    } else {
      dialog.classList.remove("closed", "open");
      dialog.classList.add("hidden");
    }

    dialogElement.setAttribute("inert", "");
  }
}
