import type { MenuConfig, MenuOption } from "../../controller/MenuController";

export default class MenuRenderer {
  static createMenuContainer(config: MenuConfig, menuId: string): HTMLElement {
    const { options, buttonAriaLabel = "More options" } = config;

    const menuContainer = document.createElement("aside");
    menuContainer.className = "more__options";
    menuContainer.setAttribute("data-menu-id", menuId);

    const menuList = document.createElement("menu");
    menuList.className = "more__options--menu__list closed";
    menuList.setAttribute("role", "menu");
    menuList.setAttribute("aria-hidden", "true");

    options.forEach(option => {
      const menuItem = this.createMenuItem(option);
      menuList.appendChild(menuItem);
    });

    menuContainer.innerHTML = `
      <button 
        class="more__options--button button button__round" 
        aria-expanded="false"
        aria-haspopup="menu"
        aria-label="${buttonAriaLabel}"
      >
        <span class="material-symbols-outlined">more_vert</span>
      </button>
    `;

    menuContainer.appendChild(menuList);

    return menuContainer;
  }

  private static createMenuItem(option: MenuOption): HTMLElement {
    const isEditOption = option.label.includes("Edit");
    const editClass = isEditOption ? "item__edit" : "";
    const itemId = option.itemId ? option.itemId : null;

    const li = document.createElement("li");
    li.className = "more__options--menu__item";
    li.setAttribute("role", "none");

    li.innerHTML = `
      <button 
        id="${option.id}"
        class="more__options--menu__option ${editClass}" 
        role="menuitem"
        aria-label="${option.label}"
        data-item-id="${itemId}"
      >
        ${option.icon ? `<span class="material-symbols-outlined">${option.icon}</span>` : ""}
        ${option.label}
      </button>
  `;

    return li;
  }
}
