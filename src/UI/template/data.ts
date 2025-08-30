import { FormField, FormConfig, FormDataCollection } from "../form/types";

export const fieldsData: FormField[] = [
  {
    name: "templateName",
    label: "Template Name",
    type: "text",
    placeholder: "Enter template name",
    required: true,
  },
  {
    name: "primaryColor",
    label: "Select Primary Color",
    type: "color",
    value: "#f13d3d",
    required: true,
  },
  {
    name: "textColor",
    label: "Select Text Color",
    type: "color",
    value: "#e9c5c5",
    required: true,
  },
  {
    name: "bgColor",
    label: "Select Background Color",
    type: "color",
    value: "#000000",
    required: true,
  },
];

export const createFormConfig = (
  onSubmit: (data: FormDataCollection) => void
): FormConfig => ({
  title: "Create Custom Template",
  submitButtonText: "Create Template",
  fieldsData: fieldsData,
  onSubmit: (rawData: FormDataCollection) => {
    const templateData = {
      templateName: rawData.templateName?.trim() || "",
      primaryColor: rawData.primaryColor || "#f13d3d",
      textColor: rawData.textColor || "#e9c5c5",
      bgColor: rawData.bgColor || "#000000",
    };
    onSubmit(templateData);
  },
});
