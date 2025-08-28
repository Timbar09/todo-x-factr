export interface Options {
  name: string;
  value: string;
  variables: string[];
}

export interface FormField {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value?: string; // Default value
  options?: Options[]; // For select or radio types
}

export interface FormDataCollection {
  [key: string]: string;
}

export interface FormConfig {
  title: string;
  submitButtonText: string;
  fieldsData: FormField[];
  onSubmit: (data: FormDataCollection) => void;
}
