import ApplicationController from "./ApplicationController";
import Template from "../model/Template";
import { defaultTemplates } from "../data/defaultTemplates";

export default class TemplateController extends ApplicationController<Template> {
  private static _instance: TemplateController;

  private _activeTemplate: Template | null = null;

  private constructor() {
    super("todo-x-factr-templates");
    this.initializeDefaultTemplates();
  }

  static get instance(): TemplateController {
    if (!TemplateController._instance) {
      TemplateController._instance = new TemplateController();
    }
    return TemplateController._instance;
  }

  get list(): Template[] {
    return this.items;
  }

  removeTemplate(id: string): void {
    const template = this.findById(id);
    if (template && !template.default) {
      this.remove(id);
    }
  }

  protected loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.items = this.deserializeItems(parsed);

        this._activeTemplate = null; // Reset active template to force re-evaluation

        const active = this.activeTemplate;
        if (active) {
          this.applyTemplate(active);
        } else {
          console.warn("No active template found after loading from storage.");
        }
      }
    } catch (error) {
      console.error(`Failed to load ${this.storageKey} from storage:`, error);
      this.items = [];
    }
  }

  // Abstract methods
  protected getId(template: Template): string {
    return template.id;
  }

  protected deserializeItems(items: any[]): Template[] {
    const templates: Template[] = items.map(item => {
      return new Template(
        item._id || item.id,
        item._active || item.active,
        item._name || item.name,
        item._colors || item.colors,
        item._description || item.description,
        item._default || item.default
      );
    });

    return templates;
  }

  protected getControllerName(): string {
    return "template";
  }

  // ✅ Active template management
  get activeTemplate(): Template {
    if (!this._activeTemplate) {
      this._activeTemplate = this.items.find(t => t.active) || this.items[0];
    }
    return this._activeTemplate;
  }

  set activeTemplate(template: Template) {
    if (!template) {
      console.warn("Cannot set null/undefined template as active");
      return;
    }

    this._activeTemplate = template;
    console.log("Setting active template to:", template);

    // ✅ Only apply if template has proper structure
    if (template.colors) {
      this.applyTemplate(template);
    }

    this.dispatchEvent("activeChanged", template);
  }

  // ✅ Template-specific business logic
  private initializeDefaultTemplates(): void {
    if (this.items.length === 0) {
      defaultTemplates.forEach(template =>
        this.add(
          new Template(
            template.id,
            template.active,
            template.name,
            template.colors,
            template.description,
            template.default
          )
        )
      );
      this._activeTemplate = null; // Reset to force re-evaluation

      this.applyTemplate(this.activeTemplate);
    }
  }

  private applyTemplate(template: Template): void {
    if (!template || !template.colors) {
      console.warn(
        "Cannot apply template: invalid template or missing colors",
        template
      );
      return;
    }

    const root = document.documentElement;

    // Set active to true for the selected template
    this.items.forEach(t => (t.active = t.id === template.id));
    this.saveToStorage();

    // Apply CSS custom properties
    Object.entries(template.colors).forEach(([key, value]) => {
      const cssVar = `--${key}`;
      root.style.setProperty(cssVar, value);
    });

    // Update body data attribute
    document.body.setAttribute("data-template", template.id);

    // Dispatch custom event for other components to listen
    this.dispatchEvent("templateChanged", template);
  }

  // ✅ Override hooks for template-specific behavior
  protected beforeRemove(template: Template): void {
    if (template.default) {
      throw new Error("Cannot remove default template");
    }

    if (this._activeTemplate?.id === template.id) {
      this._activeTemplate = this.items.find(t => t.default) || this.items[0];
    }
  }

  // get activeTemplate(): Template {
  //   return this._activeTemplate;
  // }

  // set activeTemplate(template: Template) {
  //   this._activeTemplate = template;
  //   this.applyTemplate(template);
  // }

  // get storageKey(): string {
  //   return this._storageKey;
  // }

  // set storageKey(key: string) {
  //   this._storageKey = key;
  // }

  // load(): void {
  //   const stored: string | null = localStorage.getItem(this.storageKey);

  //   if (!stored) {
  //     console.warn(
  //       "No templates found in localStorage, using default templates."
  //     );
  //     this._templates = [...defaultTemplates];
  //     return;
  //   }

  //   try {
  //     const parsedTemplates: {
  //       _id: string;
  //       _active: boolean;
  //       _name: string;
  //       _colors: ColorScheme;
  //       _description?: string;
  //       _default: boolean;
  //     }[] = JSON.parse(stored);

  //     this._templates = parsedTemplates.map(
  //       template =>
  //         new Template(
  //           template._id,
  //           template._active,
  //           template._name,
  //           template._colors,
  //           template._description,
  //           template._default
  //         )
  //     );
  //   } catch (e) {
  //     console.warn("Failed to parse templates from localStorage:", e);
  //     this._templates = [...defaultTemplates];
  //   }
  // }

  // save(): void {
  //   localStorage.setItem(this.storageKey, JSON.stringify(this._templates));
  // }

  // addTemplate(template: Template): void {
  //   this._templates.push(template);
  //   this.save();
  // }

  // findTemplateById(id: string): Template | undefined {
  //   this.load();
  //   return this._templates.find(template => template.id === id);
  // }

  // findTemplateByName(name: string): Template | undefined {
  //   this.load();
  //   return this._templates.find(template => template.name === name);
  // }

  // updateTemplate(updatedTemplate: Template): void {
  //   this._templates = this._templates.map(template =>
  //     template.id === updatedTemplate.id ? updatedTemplate : template
  //   );
  //   this.save();
  // }

  // removeTemplate(id: string): boolean {
  //   this._templates = this._templates.filter(template => template.id !== id);
  //   this.save();
  //   return true;
  // }

  // private applyTemplate(template: Template): void {
  //   const root = document.documentElement;

  //   // Set active to true for the selected template
  //   this._templates.forEach(t => (t.active = t.id === template.id));
  //   this.save();

  //   // Apply CSS custom properties
  //   Object.entries(template.colors).forEach(([key, value]) => {
  //     const cssVar = `--${key}`;
  //     root.style.setProperty(cssVar, value);
  //   });

  //   // Update body data attribute
  //   document.body.setAttribute("data-template", template.id);

  //   // Dispatch custom event for other components to listen
  //   window.dispatchEvent(
  //     new CustomEvent("templateChanged", {
  //       detail: { template },
  //     })
  //   );
  // }

  // private loadTemplate(): Template {
  //   const currentTemplate = this._templates.find(template => template.active);
  //   if (currentTemplate) {
  //     this._activeTemplate = currentTemplate;
  //     return currentTemplate;
  //   }

  //   return this._templates[0];
  // }
}
