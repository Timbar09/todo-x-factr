export interface TaskInterface {
  id: string;
  title: string;
  checked: boolean;
  categoryId: string;
}

export default class Task implements TaskInterface {
  constructor(
    private _id: string,
    private _title: string,
    private _checked: boolean = false,
    private _categoryId: string = ""
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

  get categoryId(): string {
    return this._categoryId;
  }

  set categoryId(categoryId: string) {
    this._categoryId = categoryId;
  }
}
