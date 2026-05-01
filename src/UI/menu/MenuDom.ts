const MENU_LIST_SELECTOR = ".more__options--menu__list";
const TOGGLE_BUTTON_SELECTOR = ".more__options--button";
const MENU_ITEM_SELECTOR = '[role="menuitem"]';

export default class MenuDom {
  static getMenuList(menu: HTMLElement): HTMLElement | null {
    return menu.querySelector(MENU_LIST_SELECTOR) as HTMLElement | null;
  }

  static getToggleButton(menu: HTMLElement): HTMLButtonElement | null {
    return menu.querySelector(
      TOGGLE_BUTTON_SELECTOR
    ) as HTMLButtonElement | null;
  }

  static getMenuItems(menu: HTMLElement): HTMLElement[] {
    const menuList = this.getMenuList(menu);
    if (!menuList) return [];

    return Array.from(
      menuList.querySelectorAll(MENU_ITEM_SELECTOR)
    ) as HTMLElement[];
  }

  static initializeMenu(menu: HTMLElement): void {
    const menuList = this.getMenuList(menu);
    const toggleButton = this.getToggleButton(menu);

    if (!menuList || !toggleButton) return;

    menuList.classList.add("closed");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-haspopup", "menu");
    menuList.setAttribute("aria-hidden", "true");
  }

  static setMenuOpenState(menu: HTMLElement, isOpen: boolean): void {
    const toggleButton = this.getToggleButton(menu);
    const menuList = this.getMenuList(menu);

    if (!toggleButton) return;

    if (isOpen) {
      menu.classList.remove("closed");
      menu.classList.add("open");
      toggleButton.setAttribute("aria-expanded", "true");
      menuList?.setAttribute("aria-hidden", "false");
      return;
    }

    menu.classList.remove("open");
    menu.classList.add("closed");
    toggleButton.setAttribute("aria-expanded", "false");
    menuList?.setAttribute("aria-hidden", "true");
  }

  static focusFirstMenuItem(menu: HTMLElement): void {
    const firstMenuItem = menu.querySelector(
      MENU_ITEM_SELECTOR
    ) as HTMLElement | null;
    firstMenuItem?.focus();
  }
}
