import Template, { STORAGE_KEY, ColorScheme } from "../model/Template";
import defaultTemplates from "../data/defaultTemplates";

interface Controller {
  activeTemplate: Template;
  templates: Template[];
  storageKey: string;
  load: () => void;
  save: () => void;
  addTemplate: (template: Template) => void;
  findTemplateById: (id: string) => Template | undefined;
  findTemplateByName: (name: string) => Template | undefined;
  updateTemplate: (updatedTemplate: Template) => void;
  removeTemplate: (id: string) => boolean;
}

export default class TemplateController implements Controller {
  static instance: TemplateController = new TemplateController();

  private _activeTemplate: Template;
  private _templates: Template[] = [];
  private _storageKey = STORAGE_KEY;

  constructor() {
    this.load();
    this._activeTemplate = this.loadTemplate();
    this.applyTemplate(this._activeTemplate);
  }

  get templates(): Template[] {
    return this._templates;
  }

  get activeTemplate(): Template {
    return this._activeTemplate;
  }

  set activeTemplate(template: Template) {
    this._activeTemplate = template;
    this.applyTemplate(template);
  }

  get storageKey(): string {
    return this._storageKey;
  }

  set storageKey(key: string) {
    this._storageKey = key;
  }

  load(): void {
    const stored: string | null = localStorage.getItem(this.storageKey);

    if (!stored) {
      console.warn(
        "No templates found in localStorage, using default templates."
      );
      this._templates = [...defaultTemplates];
      return;
    }

    try {
      const parsedTemplates: {
        _id: string;
        _active: boolean;
        _name: string;
        _colors: ColorScheme;
        _description?: string;
        _default: boolean;
      }[] = JSON.parse(stored);

      this._templates = parsedTemplates.map(
        template =>
          new Template(
            template._id,
            template._active,
            template._name,
            template._colors,
            template._description,
            template._default
          )
      );
    } catch (e) {
      console.warn("Failed to parse templates from localStorage:", e);
      this._templates = [...defaultTemplates];
    }
  }

  save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this._templates));
  }

  addTemplate(template: Template): void {
    this._templates.push(template);
    this.save();
  }

  findTemplateById(id: string): Template | undefined {
    this.load();
    return this._templates.find(template => template.id === id);
  }

  findTemplateByName(name: string): Template | undefined {
    this.load();
    return this._templates.find(template => template.name === name);
  }

  updateTemplate(updatedTemplate: Template): void {
    this._templates = this._templates.map(template =>
      template.id === updatedTemplate.id ? updatedTemplate : template
    );
    this.save();
  }

  removeTemplate(id: string): boolean {
    this._templates = this._templates.filter(template => template.id !== id);
    this.save();
    return true;
  }

  private applyTemplate(template: Template): void {
    const root = document.documentElement;

    // Set active to true for the selected template
    this._templates.forEach(t => (t.active = t.id === template.id));
    this.save();

    // Apply CSS custom properties
    Object.entries(template.colors).forEach(([key, value]) => {
      const cssVar = `--${key}`;
      root.style.setProperty(cssVar, value);
    });

    // Update body data attribute
    document.body.setAttribute("data-template", template.id);

    // Dispatch custom event for other components to listen
    window.dispatchEvent(
      new CustomEvent("templateChanged", {
        detail: { template },
      })
    );
  }

  private loadTemplate(): Template {
    const currentTemplate = this._templates.find(template => template.active);
    if (currentTemplate) {
      this._activeTemplate = currentTemplate;
      return currentTemplate;
    }

    return this._templates[0];
  }
}
