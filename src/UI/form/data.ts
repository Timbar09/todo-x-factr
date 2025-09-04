import CentralController from "../../controller/CentralController";
import { FormField } from "./types";

const controller = CentralController.instance;

const taskSelectOptions = controller.category.list.map(category => ({
  name: category.name,
  value: category.id,
  variables: [],
}));

export const templateFieldsData: FormField[] = [
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

export const categoryFieldsData: FormField[] = [
  {
    name: "categoryName",
    label: "Category Name",
    type: "text",
    placeholder: "Enter category name",
    required: true,
  },
  {
    name: "categoryColor",
    label: "Select Category Color",
    type: "color",
    value: "",
    required: true,
  },
];

export const taskFieldsData: FormField[] = [
  {
    label: "Task Title",
    name: "taskTitle",
    required: true,
    placeholder: "Enter task title",
  },
  {
    label: "Category",
    name: "categoryId",
    type: "select",
    placeholder: "Select Task Category",
    options: taskSelectOptions,
  },
];

export const formData = {
  templates: {
    title: "Create Custom Template",
    submitButtonText: "Create Template",
    fieldsData: templateFieldsData,
    onSubmit: () => {},
  },
  categories: {
    title: "Create Custom Category",
    submitButtonText: "Create Category",
    fieldsData: categoryFieldsData,
    onSubmit: () => {},
  },
  analytics: {
    title: "Create Custom Analytics",
    submitButtonText: "Create Analytics",
    fieldsData: [],
    onSubmit: () => {},
  },
  home: {
    title: "Create New Task",
    submitButtonText: "Create Task",
    fieldsData: taskFieldsData,
    onSubmit: () => {},
  },
};
