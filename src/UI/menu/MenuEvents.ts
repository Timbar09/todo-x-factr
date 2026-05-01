export interface MenuEventsAdapter {
  isMenuOpen: () => boolean;
  getActiveMenu: () => HTMLElement | null;
  getMenuItems: (menu: HTMLElement) => HTMLElement[];
  closeActiveMenu: () => void;
  toggleMenu: (menu: HTMLElement) => void;
  closeMenu: (menu: HTMLElement) => void;
  ownsMenu: (menuId: string) => boolean;
  getMenuOptions: (
    menuId: string
  ) => Array<{ id: string; onClick?: (event: MouseEvent) => void }> | undefined;
}

const MENU_SELECTOR = ".more__options";
// const MENU_LIST_SELECTOR = ".more__options--menu__list";
const TOGGLE_BUTTON_SELECTOR = ".more__options--button";
const MENU_ITEM_SELECTOR = '[role="menuitem"]';

export default class MenuEvents {
  private readonly adapter: MenuEventsAdapter;
  private menuContainer: HTMLElement | null = null;
  private toggleButton: HTMLButtonElement | null = null;
  private menuItem: HTMLElement | null = null;

  constructor(adapter: MenuEventsAdapter) {
    this.adapter = adapter;

    this.menuContainer = null;
    this.toggleButton = null;
    this.menuItem = null;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.addClickSupport();
    this.addClickOutsideSupport();
  }

  private addClickSupport(): void {
    document.addEventListener("click", e => {
      const target = e.target as Element;

      this.resolveClickTargetElements(target);

      if (this.toggleButton) {
        this.handleMenuButtonClick(e);
        return;
      }

      if (this.menuItem) {
        this.handleMenuItemClick(e);
      }
    });
  }

  private handleMenuButtonClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    if (!this.menuContainer) return;

    const menuId = this.menuContainer.getAttribute("data-menu-id");
    if (!menuId || !this.adapter.ownsMenu(menuId)) return;

    this.adapter.toggleMenu(this.menuContainer);
    return;
  }

  private handleMenuItemClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    if (!this.menuItem || !this.menuContainer) return;

    const menuId = this.menuContainer.getAttribute("data-menu-id");
    if (!menuId || !this.adapter.ownsMenu(menuId)) return;

    const options = this.adapter.getMenuOptions(menuId);
    if (!options) return;

    const clickedOption = options.find(
      option => option.id === this.menuItem?.id
    );
    clickedOption?.onClick?.(e as MouseEvent);

    window.dispatchEvent(
      new CustomEvent("moreMenuOptionClicked", {
        detail: {
          option: clickedOption,
          menuContainer: this.menuContainer,
          menuItem: this.menuItem,
        },
      })
    );

    this.adapter.closeMenu(this.menuContainer);
  }

  private resolveClickTargetElements(target: Element): void {
    this.menuContainer = this.getMenuContainer(target);
    this.toggleButton = this.getToggleButton(target);
    this.menuItem = this.getMenuItem(target);
  }

  private addClickOutsideSupport(): void {
    document.addEventListener("click", e => {
      if (!this.adapter.isMenuOpen()) return;

      const activeMenu = this.adapter.getActiveMenu();
      if (!activeMenu) return;

      const target = e.target as Element;
      if (!activeMenu.contains(target)) {
        this.adapter.closeActiveMenu();
      }
    });

    window.addEventListener("blur", () => {
      this.adapter.closeActiveMenu();
    });
  }

  addKeyboardSupport(menuContainer: HTMLElement): void {
    menuContainer.addEventListener("keydown", e => {
      if (!this.adapter.isMenuOpen()) return;

      const activeMenu = this.adapter.getActiveMenu();
      if (!activeMenu) return;

      const menuItems = this.adapter.getMenuItems(activeMenu);
      if (!menuItems.length) return;

      const currentIndex = menuItems.findIndex(
        item => item === document.activeElement
      );

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          this.adapter.closeActiveMenu();
          break;

        case "ArrowDown": {
          e.preventDefault();
          const nextIndex =
            currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          menuItems[nextIndex]?.focus();
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          const prevIndex =
            currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          menuItems[prevIndex]?.focus();
          break;
        }

        case "Home":
          e.preventDefault();
          menuItems[0]?.focus();
          break;

        case "End":
          e.preventDefault();
          menuItems[menuItems.length - 1]?.focus();
          break;

        case "Tab":
          this.adapter.closeActiveMenu();
          break;
      }
    });
  }

  private getMenuContainer(target: Element): HTMLElement | null {
    return target.closest(MENU_SELECTOR) as HTMLElement | null;
  }

  private getToggleButton(target: Element): HTMLButtonElement | null {
    return target.closest(TOGGLE_BUTTON_SELECTOR) as HTMLButtonElement | null;
  }

  private getMenuItem(target: Element): HTMLElement | null {
    return target.closest(MENU_ITEM_SELECTOR) as HTMLElement | null;
  }
}
