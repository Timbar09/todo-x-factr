import Template from "../model/Template";
import defaultTemplates from "../data/defaultTemplates";

export default class TemplateController {
  static instance: TemplateController = new TemplateController();

  private currentTemplate: Template;
  private customTemplates: Template[] = [];
  private storageKey = "todo-templates";
  private currentTemplateKey = "todo-current-template";

  constructor() {
    this.loadCustomTemplates();
    this.currentTemplate = this.loadCurrentTemplate();
    this.applyTemplate(this.currentTemplate);
  }

  getAllTemplates(): Template[] {
    return [...defaultTemplates, ...this.customTemplates];
  }

  getCurrentTemplate(): Template {
    return this.currentTemplate;
  }

  setTemplate(templateId: string): boolean {
    const template = this.getAllTemplates().find(t => t.id === templateId);
    if (template) {
      this.currentTemplate = template;
      this.applyTemplate(template);
      this.saveCurrentTemplate();
      return true;
    }
    return false;
  }

  addCustomTemplate(template: Template): void {
    this.customTemplates.push(template);
    this.saveCustomTemplates();
  }

  removeCustomTemplate(templateId: string): boolean {
    const index = this.customTemplates.findIndex(t => t.id === templateId);
    if (index > -1) {
      this.customTemplates.splice(index, 1);
      this.saveCustomTemplates();
      return true;
    }
    return false;
  }

  private applyTemplate(template: Template): void {
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(template.colors).forEach(([key, value]) => {
      const cssVar = `--${key}`;
      console.log(`Setting ${cssVar} to ${value}`);
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

  private loadCustomTemplates(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.customTemplates = JSON.parse(stored);
      } catch (e) {
        console.warn("Failed to load custom templates:", e);
      }
    }
  }

  private saveCustomTemplates(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.customTemplates));
  }

  private loadCurrentTemplate(): Template {
    const stored = localStorage.getItem(this.currentTemplateKey);
    if (stored) {
      const template = this.getAllTemplates().find(t => t.id === stored);
      if (template) return template;
    }
    return defaultTemplates[0]; // Default to first template
  }

  private saveCurrentTemplate(): void {
    localStorage.setItem(this.currentTemplateKey, this.currentTemplate.id);
  }
}
