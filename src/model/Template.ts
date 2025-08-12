// Export storage key for templates
export const STORAGE_KEY = "todo-templates";
export interface ColorScheme {
  primary: string;
  variant: string;
  "text-100": string;
  "text-200": string;
  "text-300": string;
  "text-400": string;
  "bg-100": string;
  "bg-200": string;
  "bg-300": string;
  // accent: string;
}

export interface TemplateInterface {
  id: string;
  active: boolean;
  name: string;
  colors: ColorScheme;
  description?: string;
  default: boolean;
}

export default class Template implements TemplateInterface {
  constructor(
    private _id: string,
    private _active: boolean = false,
    private _name: string,
    private _colors: ColorScheme,
    private _description?: string,
    private _default: boolean = false
  ) {}

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get active(): boolean {
    return this._active;
  }

  set active(active: boolean) {
    this._active = active;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get colors(): ColorScheme {
    return this._colors;
  }

  set colors(colors: ColorScheme) {
    this._colors = colors;
  }

  get description(): string | undefined {
    return this._description;
  }

  set description(description: string | undefined) {
    this._description = description;
  }

  get default(): boolean {
    return this._default;
  }

  set default(defaultValue: boolean) {
    this._default = defaultValue;
  }
}
