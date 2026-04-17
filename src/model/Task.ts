export interface TaskInterface {
  id: string;
  title: string;
  checked: boolean;
  categoryId: string;
  dateCreated: Date;
  dateUpdated: Date;
  dateDue: null | Date;
}

export default class Task implements TaskInterface {
  private touch(): void {
    this._dateUpdated = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      checked: this._checked,
      categoryId: this._categoryId,
      dateCreated: this._dateCreated.toISOString(),
      dateUpdated: this._dateUpdated.toISOString(),
      dateDue: this._dateDue ? this._dateDue.toISOString() : null,
    };
  }

  constructor(
    private _id: string,
    private _title: string,
    private _checked: boolean = false,
    private _categoryId: string = "",
    private _dateCreated: Date = new Date(),
    private _dateUpdated: Date = new Date(),
    private _dateDue: null | Date = null
  ) {}

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
    this.touch();
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;
    this.touch();
  }

  get checked(): boolean {
    return this._checked;
  }

  set checked(checked: boolean) {
    this._checked = checked;
    // this.touch();
  }

  get categoryId(): string {
    return this._categoryId;
  }

  set categoryId(categoryId: string) {
    this._categoryId = categoryId;
    this.touch();
  }

  get dateCreated(): Date {
    return this._dateCreated;
  }

  set dateCreated(date: Date) {
    this._dateCreated = date;
  }

  get dateUpdated(): Date {
    return this._dateUpdated;
  }

  set dateUpdated(date: Date) {
    this._dateUpdated = date;
  }

  get dateDue(): Date | null {
    return this._dateDue;
  }

  set dateDue(date: Date | null) {
    this._dateDue = date;
    this.touch();
  }
}
