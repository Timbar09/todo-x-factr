import CategoryItem from "./CategoryItem";

export interface Item {
  id: string;
  title: string;
  checked: boolean;
  category?: CategoryItem;
}

export default class ListItem implements Item {
  category?: CategoryItem;

  constructor(
    private _id: string,
    private _title: string,
    private _checked: boolean = false
  ) {}

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;
  }

  get checked(): boolean {
    return this._checked;
  }

  set checked(checked: boolean) {
    this._checked = checked;
  }
}
