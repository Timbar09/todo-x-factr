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

export interface FormConfig {
  title: string;
  action: string;
  submitButtonText: string;
  fieldsData: FormField[];
  onSubmit: (data: Record<string, string>) => void;
}

export default class FormUI {
  private form: HTMLFormElement;
  private formTitle: string;
  private action: string = "create";
  private fieldsData: FormField[];
  private submitButtonText: string;
  private onSubmit: (data: Record<string, string>) => void;

  constructor(formConfig: FormConfig) {
    const { title, action, submitButtonText, fieldsData, onSubmit } =
      formConfig;

    this.formTitle = title;
    this.action = action;
    this.form = document.createElement("form");
    this.form.className = "form";
    this.form.setAttribute("action", this.action);

    this.fieldsData = fieldsData;
    this.submitButtonText = submitButtonText;
    this.onSubmit = onSubmit;

    this.createForm();
  }

  renderInto(dialogEl: HTMLElement) {
    const container = document.createElement("div");
    container.className = "form__container";

    container.innerHTML = `
      <h2 class="offscreen">${this.formTitle}</h2>
    `;

    container.appendChild(this.form);
    dialogEl.appendChild(container);
  }

  createForm(): HTMLFormElement {
    this.fieldsData.forEach(fieldData => {
      const formField = this.createFormField(fieldData);
      this.form.appendChild(formField);
    });

    const formActions = this.createSubmitButton(this.submitButtonText);
    this.form.appendChild(formActions);

    this.bindEvents();

    return this.form;
  }

  createFormField(fieldData: FormField): HTMLDivElement {
    const typeValue = fieldData.type || "text";

    const formField = document.createElement("div");
    formField.className = `form__field form__field--${typeValue}`;

    switch (typeValue) {
      case "textarea":
        this.createTextAreaField(formField, fieldData);
        break;
      case "select":
        this.createSelectField(formField, fieldData);
        break;
      case "radio":
        this.createRadioField(formField, fieldData);
        break;
      case "color":
        this.createColorField(formField, fieldData);
        break;
      default:
        this.createInputField(formField, fieldData);
    }

    return formField;
  }

  createSubmitButton(submitButtonText: string) {
    const formActions = document.createElement("div");
    formActions.className = "form__actions";

    formActions.innerHTML = `
      <button type="submit" class="button button__primary button__primary--bar">
        <span> ${submitButtonText} </span>
        
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

  createColorField(formField: HTMLDivElement, fieldData: FormField): void {
    const { name, label, value } = fieldData;

    formField.innerHTML = `
      <label for="${name}" class="form__field--label">${label}</label>
      <input 
      class="form__field--input"
        type="color" 
        name="${name}" 
        id="${name}"
        value="${value}"
      >
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
    const mode = this.form.dataset.mode || "create";

    const data: Record<string, string> = {};
    data["mode"] = mode;
    console.log(data);

    let isValid = true;

    this.fieldsData.forEach(fieldData => {
      const input = this.form.elements.namedItem(
        fieldData.name
      ) as HTMLInputElement;
      const value = input?.value?.trim() || "";

      if (fieldData.required && !value) {
        isValid = false;
        this.showFieldErrors(fieldData.name, `${fieldData.label} is required`);
        return;
      }

      this.clearFieldErrors(fieldData.name);
      data[fieldData.name] = value;
    });

    if (!isValid) return;

    this.onSubmit(data);
    this.reset();
  }

  private showFieldErrors(fieldName: string, message: string): void {
    const field = this.form
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

  private clearFieldErrors(fieldName: string): void {
    const field = this.form
      .querySelector(`[name="${fieldName}"]`)
      ?.closest(".form__field") as HTMLElement;

    if (field) {
      field.classList.remove("form__field--error");
      field.removeAttribute("data-error-message");
    }
  }

  private clearAllErrors(): void {
    const errorFields = this.form.querySelectorAll(".form__field--error");

    errorFields.forEach(field => field.classList.remove("form__field--error"));
  }

  bindEvents() {
    this.form.addEventListener("submit", e => {
      this.getFormData(e);
    });

    this.form.addEventListener("input", e => {
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
    const labels = this.form.querySelectorAll(
      ".form__field--label"
    ) as NodeListOf<HTMLElement>;
    const customSelects = this.form.querySelectorAll(
      ".form__select--custom__button"
    ) as NodeListOf<HTMLElement>;

    labels.forEach(label => label.classList.add("offscreen"));
    customSelects.forEach(select => {
      select.innerText = select.getAttribute("data-placeholder") || "";
      select.classList.add("form__field--input__placeholder-title");
    });

    this.form.reset();
    this.clearAllErrors();
  }
}
