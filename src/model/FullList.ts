import ListItem from "./ListItem";

interface List {
  list: ListItem[];
  load: () => void;
  save: () => void;
  clearList: () => void;
  ClearCompleted: () => void;
  addItem: (item: ListItem) => void;
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

    const parsedList: {
      _id: string;
      _title: string;
      _checked: boolean;
      _categoryId: string;
    }[] = JSON.parse(storedList);

    this._list = parsedList.map(
      (item) =>
        new ListItem(item._id, item._title, item._checked, item._categoryId)
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

  addItem(item: ListItem): void {
    this._list.unshift(item);
    this.save();
  }

  removeItem(id: string): void {
    this._list = this._list.filter((item) => item.id !== id);
    this.save();
  }
}
