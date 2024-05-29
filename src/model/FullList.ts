import ListItem from "./ListItem";
import CategoryItem from "./CategoryItem";

interface List {
  list: ListItem[];
  load: () => void;
  save: () => void;
  clearList: () => void;
  ClearCompleted: () => void;
  addItem: (item: ListItem, category?: CategoryItem) => void;
  removeItem: (id: string) => void;
}

export default class FullList implements List {
  static instance: FullList = new FullList();

  private constructor(private _list: ListItem[] = []) {}

  get list(): ListItem[] {
    return this._list;
  }

  load(): void {
    const storedList: string | null = localStorage.getItem("list");

    if (typeof storedList !== "string") return;

    const parsedList: { _id: string; _item: string; _checked: boolean }[] =
      JSON.parse(storedList);

    this._list = parsedList.map(
      (item) => new ListItem(item._id, item._item, item._checked)
    );
  }

  save(): void {
    localStorage.setItem("list", JSON.stringify(this._list));
  }

  clearList(): void {
    this._list = [];
    this.save();
  }

  ClearCompleted(): void {
    this._list = this._list.filter((item) => !item.checked);
    this.save();
  }

  addItem(item: ListItem, category?: CategoryItem): void {
    item.category = category;
    this._list.unshift(item);
    this.save();
  }

  removeItem(id: string): void {
    this._list = this._list.filter((item) => item.id !== id);
    this.save();
  }
}
