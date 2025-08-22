import CustomSelectInputUI from "./CustomSelectInputUI";

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

export default class FormUI {
  private formElement: HTMLFormElement;
  private fieldData: FormField[];
  private onSubmit: (data: Record<string, string>) => void;

  constructor(
    fieldData: FormField[],
    onSubmit: (data: Record<string, string>) => void
  ) {
    this.formElement = document.createElement("form");
    this.formElement.className = "form";

    this.fieldData = fieldData;
    this.onSubmit = onSubmit;

    this.createForm();
  }

  render(container: HTMLElement) {
    container.appendChild(this.formElement);
  }

  createForm(): HTMLFormElement {
    this.fieldData.forEach(data => {
      const formField = this.createFormField(data);
      this.formElement.appendChild(formField);
    });

    const formActions = this.createSubmitButton();
    this.formElement.appendChild(formActions);

    this.bindEvents();

    return this.formElement;
  }

  createFormField(field: FormField): HTMLDivElement {
    const typeValue = field.type || "text";

    const formField = document.createElement("div");
    formField.className = `form__field form__field--${typeValue}`;

    switch (typeValue) {
      case "textarea":
        this.createTextAreaField(formField, field);
        break;
      case "select":
        this.createSelectField(formField, field);
        break;
      case "radio":
        this.createRadioField(formField, field);
        break;
      default:
        this.createInputField(formField, field);
    }

    return formField;
  }

  createSubmitButton() {
    const formActions = document.createElement("div");
    formActions.className = "form__actions";

    formActions.innerHTML = `
      <button type="submit" class="button button__primary button__primary--bar">
        <span>Submit</span>
        <span class="material-symbols-outlined"> keyboard_arrow_up </span>
      </button>
    `;

    return formActions;
  }

  createTextAreaField(formField: HTMLDivElement, fieldData: FormField): void {
    const { name, label } = fieldData;
    const placeholderValue = fieldData.placeholder || "";

    formField.innerHTML = `
    <label for="${name}" class="form__field--label offscreen">${label}</label>
    <textarea 
      name="${name}" 
      id="${name}" 
      class="form__field--input" 
      placeholder="${placeholderValue}"
    ></textarea>
    `;
  }

  createSelectField(formField: HTMLDivElement, fieldData: FormField): void {
    const label = document.createElement("label");
    label.htmlFor = `${fieldData.name}SelectButton`;
    label.className = "form__field--label offscreen";
    label.id = `${fieldData.name}SelectLabel`;
    label.textContent = fieldData.label;

    formField.appendChild(label);

    const selectInput = new CustomSelectInputUI(fieldData);

    selectInput.renderInTo(formField);
  }

  createRadioField(formField: HTMLDivElement, fieldData: FormField): void {
    const { label, options } = fieldData;

    formField.innerHTML = `
      <fieldset class="form__field--radio__fieldset">
        <legend class="form__field--input form__field--radio__legend">${label}</legend>

        <div class="form__field--radio__group">
          ${options
            ?.map(option => {
              const { name, value, variables } = option;
              const styles = variables.join(", ");

              return `
              <label for="${name}" class="form__field--radio__label" style="${styles}">
                <input 
                  type="radio" 
                  id="${value}"
                  class="form__field--radio__input"
                  name="${name}" 
                  value="${value}" 
                >

                <span class="form__field--radio__title">${name}</span>
              </label>`;
            })
            .join("")}
        </div>
      </fieldset>
    `;
  }

  createInputField(formField: HTMLDivElement, fieldData: FormField): void {
    const { name, label } = fieldData;
    const placeholderValue = fieldData.placeholder || "";

    formField.innerHTML = `
      <label for="${name}" class="form__field--label offscreen">${label}</label>
      <input 
        type="text" 
        name="${name}" 
        id="${name}"
        class="form__field--input"
        placeholder="${placeholderValue}"
      >
    `;
  }

  getFormData(event: Event) {
    event.preventDefault();

    const data: Record<string, string> = {};
    let isValid = true;

    this.fieldData.forEach(field => {
      const input = this.formElement.elements.namedItem(
        field.name
      ) as HTMLInputElement;
      const value = input?.value?.trim() || "";

      if (field.required && !value) {
        isValid = false;
        this.showFieldError(field.name, `${field.label} is required`);
        return;
      }

      this.clearFieldError(field.name);
      data[field.name] = value;
    });

    if (!isValid) return;

    this.onSubmit(data);
  }

  private showFieldError(fieldName: string, message: string): void {
    const field = this.formElement
      .querySelector(`[name="${fieldName}"]`)
      ?.closest(".form__field") as HTMLElement;
    const input = field?.querySelector(
      ".form__field--input"
    ) as HTMLInputElement;

    if (field) {
      field.classList.add("form__field--error");
      field.setAttribute("data-error-message", message);
      input.focus();
    }
  }

  private clearFieldError(fieldName: string): void {
    const field = this.formElement
      .querySelector(`[name="${fieldName}"]`)
      ?.closest(".form__field") as HTMLElement;

    if (field) {
      field.classList.remove("form__field--error");
      field.removeAttribute("data-error-message");
    }
  }

  bindEvents() {
    this.formElement.addEventListener("submit", e => {
      this.getFormData(e);
    });

    this.formElement.addEventListener("input", e => {
      const target = e.target as HTMLInputElement;

      if (target.closest(".form__field--input")) {
        const label = target.closest(".form__field--input")
          ?.previousElementSibling as HTMLElement;

        if (label) {
          if (target.value?.length > 0) {
            label.classList.remove("offscreen");
            target.classList.remove("form__field--error");
          } else {
            label.classList.add("offscreen");
          }
        }
      }
    });
  }

  reset() {
    this.formElement.reset();

    const errorFields = this.formElement.querySelectorAll(
      ".form__field--error"
    );

    errorFields.forEach(field => field.classList.remove("form__field--error"));
  }
}
