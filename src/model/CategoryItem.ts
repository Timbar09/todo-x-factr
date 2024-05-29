export interface Category {
  id: string;
  name: string;
  color: string;
}

export default class CategoryItem implements Category {
  constructor(
    private _id: string,
    private _name: string,
    private _color: string
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
}
