export interface MenuInterface {
  menu: HTMLElement;
  isMenuOpen: boolean;
  open(): void;
  close(): void;
  toggle(): void;
}

export default class MenuController implements MenuInterface {
  private static instance: MenuController;
  public menu: HTMLElement;
  public isMenuOpen: boolean = false;

  private constructor() {
    const menuElement = document.getElementById("menu");
    if (!menuElement) {
      throw new Error("Menu element with id 'menu' not found");
    }
    this.menu = menuElement;
    this.init();
  }

  public static getInstance(): MenuController {
    if (!MenuController.instance) {
      MenuController.instance = new MenuController();
    }
    return MenuController.instance;
  }

  open(): void {
    if (this.isMenuOpen) {
      window.dispatchEvent(new CustomEvent("menuAlreadyOpen"));

      return;
    }

    this.menu.classList.remove("closed");
    this.menu.classList.add("open");
  }

  close(): void {
    if (!this.isMenuOpen) return;

    this.menu.classList.remove("open");
    this.menu.classList.add("closed");

    window.dispatchEvent(new CustomEvent("menuClosed"));
  }

  toggle(): void {
    if (this.isMenuOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  private init(): void {
    this.bindEvents();
    this.addKeyboardSupport();
    this.addClickOutsideSupport();
  }

  private bindEvents(): void {
    // TODO: Add openMenu event listeners for all openButton elements
    const openButton = document.getElementById("openMenuButton");
    const closeButton = document.getElementById("closeMenuButtonButton");

    if (openButton) {
      openButton.addEventListener("click", () => this.open());
    }

    if (closeButton) {
      closeButton.addEventListener("click", () => this.close());
    }
  }

  private addKeyboardSupport(): void {
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && this.isMenuOpen) {
        this.close();
      }
    });
  }

  private addClickOutsideSupport(): void {
    document.addEventListener("click", e => {
      const target = e.target as Element;
      const isClickInside = this.menu.contains(target);
      const isOpenButton = target.closest("#openMenuButton");
      const isTemplate = target.closest(".template__item");

      if (!isClickInside && !isOpenButton && this.isMenuOpen && !isTemplate) {
        this.close();
      }
    });
  }
}
