import {
  addClass,
  removeClass,
  // setSectionFocusStatus,
} from "../functions/Reusable";

// MoreMenu Structure
//
// <aside class="more__options">
//   <button
//     class="more__options--button button"
//     aria-expanded="false"
//     aria-haspopup="menu"
//   >
//     <span class="material-symbols-outlined">more_vert</span>
//   </button>

//   <menu class="more__options--menu__list closed" role="menu" aria-hidden="true">
//     <li class="more__options--menu__item" role="none">
//       <button
//         class="more__options--menu__option"
//         role="menuitem"
//         data-action="delete"
//       >
//         Delete Template
//       </button>
//     </li>
//   </menu>
// </aside>

export interface MoreMenuOption {
  id: string;
  label: string;
  action: string;
  icon?: string;
}

export interface MoreMenuConfig {
  options: MoreMenuOption[];
  buttonAriaLabel?: string;
}

export default class MoreMenuController {
  private static instance: MoreMenuController;

  isMoreMenuOpen: boolean = false;
  activeMenu: HTMLElement | null = null;

  private constructor() {
    this.init();
  }

  static getInstance(): MoreMenuController {
    if (!MoreMenuController.instance) {
      MoreMenuController.instance = new MoreMenuController();
    }
    return MoreMenuController.instance;
  }

  private init(): void {
    this.bindEvents();
    this.addClickOutsideSupport();
  }

  createMenu(config: MoreMenuConfig): HTMLElement {
    const { options, buttonAriaLabel = "More options" } = config;

    const menuContainer = document.createElement("aside");
    menuContainer.className = "more__options";

    menuContainer.innerHTML = `
      <button 
        class="more__options--button button button__round" 
        aria-expanded="false"
        aria-haspopup="menu"
        aria-label="${buttonAriaLabel}"
      >
        <span class="material-symbols-outlined">more_vert</span>
      </button>

      <menu class="more__options--menu__list closed" role="menu" aria-hidden="true">
        ${options
          .map(option => {
            return `
          <li class="more__options--menu__item" role="none">
            <button 
              id="${option.id}"
              class="more__options--menu__option" 
              role="menuitem"
              data-action="${option.action}"
              aria-label="${option.label}"
            >
              ${option.icon ? `<span class="material-symbols-outlined">${option.icon}</span>` : ""}
              ${option.label}
            </button>
          </li>
        `;
          })
          .join("")}
      </menu>
    `;

    this.initializeMenu(menuContainer);
    this.addKeyboardSupport(menuContainer);

    return menuContainer;
  }

  private initializeMenu(menu: HTMLElement): void {
    const menuList = menu.querySelector(
      ".more__options--menu__list"
    ) as HTMLElement;
    const toggleButton = menu.querySelector(
      ".more__options--button"
    ) as HTMLButtonElement;

    if (menuList && toggleButton) {
      addClass(menuList, "closed");
      toggleButton.setAttribute("aria-expanded", "false");
      toggleButton.setAttribute("aria-haspopup", "menu");
      menuList.setAttribute("aria-hidden", "true");
    }
  }

  open(menuElement: HTMLElement): void {
    if (this.isMoreMenuOpen && this.activeMenu === menuElement) {
      return; // Already open
    }

    // Close any other open menus first
    this.closeAll();

    const menuList = menuElement.querySelector(
      ".more__options--menu__list"
    ) as HTMLElement;
    const toggleButton = menuElement.querySelector(
      ".more__options--button"
    ) as HTMLButtonElement;

    if (!menuList || !toggleButton) {
      console.warn("Menu structure not found");
      return;
    }

    // Open this menu
    removeClass(menuList, "closed");
    addClass(menuList, "open");
    toggleButton.setAttribute("aria-expanded", "true");
    menuList.setAttribute("aria-hidden", "false");

    // Update state
    this.isMoreMenuOpen = true;
    this.activeMenu = menuElement;

    // Focus management
    // setSectionFocusStatus("more-menu", true);

    // Focus first menu item
    const firstMenuItem = menuList.querySelector(
      '[role="menuitem"]'
    ) as HTMLElement;
    if (firstMenuItem) {
      firstMenuItem.focus();
    }

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("moreMenuOpened", {
        detail: { menuElement },
      })
    );
  }

  close(menuElement?: HTMLElement): void {
    const targetMenu = menuElement || this.activeMenu;

    if (!targetMenu) return;

    const menuList = targetMenu.querySelector(
      ".more__options--menu__list"
    ) as HTMLElement;
    const toggleButton = targetMenu.querySelector(
      ".more__options--button"
    ) as HTMLButtonElement;

    if (!menuList || !toggleButton) return;

    // Close the menu
    removeClass(menuList, "open");
    addClass(menuList, "closed");
    toggleButton.setAttribute("aria-expanded", "false");
    menuList.setAttribute("aria-hidden", "true");

    // Update state if this was the active menu
    if (targetMenu === this.activeMenu) {
      this.isMoreMenuOpen = false;
      this.activeMenu = null;
      // setSectionFocusStatus("more-menu", false);
    }

    // Return focus to toggle button
    toggleButton.focus();

    // Dispatch event
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
      const menuList = menu.querySelector(
        ".more__options--menu__list"
      ) as HTMLElement;
      const toggleButton = menu.querySelector(
        ".more__options--button"
      ) as HTMLButtonElement;

      if (menuList && toggleButton) {
        removeClass(menuList, "open");
        addClass(menuList, "closed");
        toggleButton.setAttribute("aria-expanded", "false");
        menuList.setAttribute("aria-hidden", "true");
      }
    });

    this.isMoreMenuOpen = false;
    this.activeMenu = null;
  }

  toggle(menuElement: HTMLElement): void {
    if (this.isMoreMenuOpen && this.activeMenu === menuElement) {
      this.close(menuElement);
    } else {
      this.open(menuElement);
    }
  }

  private bindEvents(): void {
    document.addEventListener("click", e => {
      const target = e.target as Element;

      // Handle toggle button clicks
      const toggleButton = target.closest(
        ".more__options--button"
      ) as HTMLButtonElement;
      if (toggleButton) {
        e.preventDefault();
        e.stopPropagation();

        const menuContainer = toggleButton.closest(
          ".more__options"
        ) as HTMLElement;
        if (menuContainer) {
          this.toggle(menuContainer);
        }
        return;
      }

      // Handle menu item clicks
      const menuItem = target.closest('[role="menuitem"]') as HTMLElement;
      if (menuItem) {
        const menuContainer = menuItem.closest(".more__options") as HTMLElement;
        if (menuContainer) {
          // Close menu after action
          setTimeout(() => this.close(menuContainer), 100);
        }
        return;
      }
    });
  }

  private addKeyboardSupport(menuContainer: HTMLElement): void {
    menuContainer.addEventListener("keydown", e => {
      if (!this.isMoreMenuOpen || !this.activeMenu) return;

      const menuList = this.activeMenu.querySelector(
        ".more__options--menu__list"
      ) as HTMLElement;
      if (!menuList) return;

      const menuItems = Array.from(
        menuList.querySelectorAll('[role="menuitem"]')
      ) as HTMLElement[];
      const currentIndex = menuItems.findIndex(
        item => item === document.activeElement
      );

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          this.close(this.activeMenu);
          break;

        case "ArrowDown":
          e.preventDefault();
          const nextIndex =
            currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          menuItems[nextIndex]?.focus();
          break;

        case "ArrowUp":
          e.preventDefault();
          const prevIndex =
            currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          menuItems[prevIndex]?.focus();
          break;

        case "Home":
          e.preventDefault();
          menuItems[0]?.focus();
          break;

        case "End":
          e.preventDefault();
          menuItems[menuItems.length - 1]?.focus();
          break;

        case "Tab":
          // Close menu on tab (focus moves outside)
          this.close(this.activeMenu);
          break;
      }
    });
  }

  private addClickOutsideSupport(): void {
    document.addEventListener("click", e => {
      if (!this.isMoreMenuOpen || !this.activeMenu) return;

      const target = e.target as Element;
      const isClickInside = this.activeMenu.contains(target);

      if (!isClickInside) {
        this.closeAll();
      }
    });

    // Close on window blur
    window.addEventListener("blur", () => {
      this.closeAll();
    });
  }
}
