import type { MenuOption } from ".";

export default class MenuRegistry {
  private readonly menuOptions = new Map<string, MenuOption[]>();

  register(menuId: string, options: MenuOption[]): void {
    this.menuOptions.set(menuId, options);
  }

  get(menuId: string): MenuOption[] | undefined {
    return this.menuOptions.get(menuId);
  }

  remove(menuId: string): void {
    this.menuOptions.delete(menuId);
  }
}
