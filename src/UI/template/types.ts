import Template from "../../model/Template";

export interface FormDataCollection {
  templateName: string;
  primaryColor: string;
  textColor: string;
  bgColor: string;
}

export interface TemplateMenuConfig {
  templateId: string;
  isDefault: boolean;
  onEdit: (templateId: string) => void;
  onDelete: (templateId: string) => void;
}

export interface TemplateRenderConfig {
  templates: Template[];
  activeTemplate: Template;
  menuContent: HTMLElement;
}
