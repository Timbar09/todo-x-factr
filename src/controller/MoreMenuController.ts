import { addClass, removeClass } from "../functions/Reusable";

export interface MoreMenuOption {
  id: string;
  label: string;
  icon?: string;
  onClick?: (event: MouseEvent) => void;
}

export interface MoreMenuConfig {
  options: MoreMenuOption[];
  buttonAriaLabel?: string;
}

export default class MoreMenuController {
  private static instance: MoreMenuController;

  isMoreMenuOpen: boolean = false;
  activeMenu: HTMLElement | null = null;

  private menuOptions: Map<string, MoreMenuOption[]> = new Map();

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
    this.addClickOutsideSupport();
    this.bindEvents();
  }

  createMenu(config: MoreMenuConfig): HTMLElement {
    const { options, buttonAriaLabel = "More options" } = config;

    const menuContainer = document.createElement("aside");
    menuContainer.className = "more__options";

    const menuId = crypto.randomUUID();
    menuContainer.setAttribute("data-menu-id", menuId);

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

    this.menuOptions.set(menuId, options);

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

    const toggleButton = menuElement.querySelector(
      ".more__options--button"
    ) as HTMLButtonElement;

    if (!menuElement || !toggleButton) {
      console.warn("Menu structure not found");
      return;
    }

    // Open this menu
    removeClass(menuElement, "closed");
    addClass(menuElement, "open");
    toggleButton.setAttribute("aria-expanded", "true");
    menuElement
      .querySelector(".more__options--menu__list")
      ?.setAttribute("aria-hidden", "false");

    // Update state
    this.isMoreMenuOpen = true;
    this.activeMenu = menuElement;

    // Focus first menu item
    const firstMenuItem = menuElement.querySelector(
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

    const toggleButton = targetMenu.querySelector(
      ".more__options--button"
    ) as HTMLButtonElement;

    if (!targetMenu || !toggleButton) return;

    // Close the menu
    removeClass(targetMenu, "open");
    addClass(targetMenu, "closed");
    toggleButton.setAttribute("aria-expanded", "false");
    targetMenu
      .querySelector(".more__options--menu__list")
      ?.setAttribute("aria-hidden", "true");

    if (targetMenu === this.activeMenu) {
      this.isMoreMenuOpen = false;
      this.activeMenu = null;
    }

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
      const toggleButton = menu.querySelector(
        ".more__options--button"
      ) as HTMLButtonElement;

      if (menu && toggleButton) {
        removeClass(menu, "open");
        addClass(menu, "closed");
        toggleButton.setAttribute("aria-expanded", "false");
        menu
          .querySelector(".more__options--menu__list")
          ?.setAttribute("aria-hidden", "true");
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
        this.toggle(menuContainer);

        return;
      }

      // Handle menu item clicks
      const menuItem = target.closest('[role="menuitem"]') as HTMLElement;
      if (menuItem) {
        e.preventDefault();
        e.stopPropagation();

        const menuContainer = menuItem.closest(".more__options") as HTMLElement;

        if (!menuContainer) {
          console.error("Menu container not found for menu item:", menuItem);
          return;
        }

        const menuId = menuContainer.getAttribute("data-menu-id");
        if (!menuId) {
          console.error("Menu ID not found on menu container:", menuContainer);
          return;
        }

        const options = this.menuOptions.get(menuId);
        if (!options) {
          console.error("Options not found on menu container:", menuContainer);
          console.log("Available properties:", Object.keys(menuContainer));
          return;
        }

        console.log("Found options:", options);

        this.handleMenuItemClick(
          e as MouseEvent,
          menuItem,
          options,
          menuContainer
        );
      }
    });
  }

  private handleMenuItemClick(
    e: MouseEvent,
    menuItem: HTMLElement,
    options: MoreMenuOption[],
    menuContainer: HTMLElement
  ): void {
    e.preventDefault();
    e.stopPropagation();

    const clickedOption = options.find(option => option.id === menuItem.id);

    if (clickedOption && clickedOption.onClick) {
      clickedOption.onClick(e as MouseEvent);
    }

    // ✅ Dispatch custom event with option data
    window.dispatchEvent(
      new CustomEvent("moreMenuOptionClicked", {
        detail: {
          option: clickedOption,
          menuContainer,
          menuItem,
        },
      })
    );

    this.close(menuContainer);
    return;
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
