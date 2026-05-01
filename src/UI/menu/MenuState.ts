import MenuDom from "./MenuDom";

export interface MenuStateAdapter {
  getIsMenuOpen: () => boolean;
  setIsMenuOpen: (value: boolean) => void;
  getActiveMenu: () => HTMLElement | null;
  setActiveMenu: (menu: HTMLElement | null) => void;
}

export default class MenuState {
  private readonly adapter: MenuStateAdapter;

  constructor(adapter: MenuStateAdapter) {
    this.adapter = adapter;
  }

  open(menuElement: HTMLElement): void {
    if (
      this.adapter.getIsMenuOpen() &&
      this.adapter.getActiveMenu() === menuElement
    ) {
      return;
    }

    this.closeAll();

    const toggleButton = MenuDom.getToggleButton(menuElement);
    if (!toggleButton) {
      console.warn("Menu structure not found");
      return;
    }

    MenuDom.setMenuOpenState(menuElement, true);

    this.adapter.setIsMenuOpen(true);
    this.adapter.setActiveMenu(menuElement);

    MenuDom.focusFirstMenuItem(menuElement);

    window.dispatchEvent(
      new CustomEvent("moreMenuOpened", {
        detail: { menuElement },
      })
    );
  }

  close(menuElement?: HTMLElement): void {
    const targetMenu = menuElement || this.adapter.getActiveMenu();
    if (!targetMenu) return;

    const toggleButton = MenuDom.getToggleButton(targetMenu);
    if (!toggleButton) return;

    MenuDom.setMenuOpenState(targetMenu, false);

    if (targetMenu === this.adapter.getActiveMenu()) {
      this.adapter.setIsMenuOpen(false);
      this.adapter.setActiveMenu(null);
    }

    toggleButton.focus();

    window.dispatchEvent(
      new CustomEvent("moreMenuClosed", {
        detail: { menuElement: targetMenu },
      })
    );
  }

  closeAll(): void {
    const allMenus = document.querySelectorAll(
      ".more__options"
    ) as NodeListOf<HTMLElement>;

    allMenus.forEach(menu => {
      const toggleButton = MenuDom.getToggleButton(menu);
      if (toggleButton) {
        MenuDom.setMenuOpenState(menu, false);
      }
    });

    this.adapter.setIsMenuOpen(false);
    this.adapter.setActiveMenu(null);
  }

  toggle(menuElement: HTMLElement): void {
    if (
      this.adapter.getIsMenuOpen() &&
      this.adapter.getActiveMenu() === menuElement
    ) {
      this.close(menuElement);
    } else {
      this.open(menuElement);
    }
  }
}
