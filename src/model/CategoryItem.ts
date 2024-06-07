export interface Category {
  id: string;
  name: string;
  color: string;
  items: string[];
  addItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clearItems: () => void;
}

export default class CategoryItem implements Category {
  constructor(
    private _id: string,
    private _name: string,
    private _color: string,
    private _items: string[] = []
  ) {}

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get color(): string {
    return this._color;
  }

  set color(color: string) {
    this._color = color;
  }

  get items(): string[] {
    return this._items;
  }

  addItem(itemId: string): void {
    this._items.push(itemId);
  }

  removeItem(itemId: string): void {
    this._items = this._items.filter((id) => id !== itemId);
  }

  clearItems(): void {
    this._items = [];
  }
}
