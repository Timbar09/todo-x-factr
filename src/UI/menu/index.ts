// import { MoreMenuOption } from "../../controller/MoreMenuController";
import MenuDom from "./MenuDom";
import MenuEvents from "./MenuEvents";
import MenuRegistry from "./MenuRegistry";
import MenuRenderer from "./MenuRenderer";
import MenuState from "./MenuState";

export interface MenuOption {
  id: string;
  itemId?: string;
  label: string;
  icon?: string;
  onClick?: (event: MouseEvent) => void;
}

export interface MenuConfig {
  options: MenuOption[];
  buttonAriaLabel?: string;
}

export default class MenuUI {
  isMenuOpen: boolean = false;
  activeMenu: HTMLElement | null = null;

  private readonly menuRegistry = new MenuRegistry();
  private readonly menuEvents: MenuEvents;
  private readonly menuState: MenuState;

  constructor() {
    this.menuState = new MenuState({
      getIsMenuOpen: () => this.isMenuOpen,
      setIsMenuOpen: value => {
        this.isMenuOpen = value;
      },
      getActiveMenu: () => this.activeMenu,
      setActiveMenu: menu => {
        this.activeMenu = menu;
      },
    });

    this.menuEvents = new MenuEvents({
      isMenuOpen: () => this.isMenuOpen,
      getActiveMenu: () => this.activeMenu,
      getMenuItems: menu => MenuDom.getMenuItems(menu),
      closeActiveMenu: () => this.menuState.close(this.activeMenu ?? undefined),
      toggleMenu: menu => this.menuState.toggle(menu),
      closeMenu: menu => this.menuState.close(menu),
      ownsMenu: menuId => Boolean(this.menuRegistry.get(menuId)),
      getMenuOptions: menuId => this.menuRegistry.get(menuId),
    });
  }

  renderMenu(config: MenuConfig): HTMLElement {
    const menuId = crypto.randomUUID();
    const menu = MenuRenderer.createMenuContainer(config, menuId);

    this.menuRegistry.register(menuId, config.options);

    MenuDom.initializeMenu(menu);

    this.menuEvents.addKeyboardSupport(menu);

    return menu;
  }

  open(menuElement: HTMLElement): void {
    this.menuState.open(menuElement);
  }

  close(menuElement?: HTMLElement): void {
    this.menuState.close(menuElement);
  }

  closeAll(): void {
    this.menuState.closeAll();
  }

  toggle(menuElement: HTMLElement): void {
    this.menuState.toggle(menuElement);
  }
}
