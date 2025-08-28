import CustomSelectInputUI from "./CustomSelectInputUI";
import { FormConfig, FormField } from "./types";

export default class FormUI {
  private form: HTMLFormElement;
  private formTitle: string;
  private mode: string;
  private fieldsData: FormField[];
  private submitButtonText: string;
  private onSubmit: (data: Record<string, string>) => void;
  private currentItemId?: string;
  private customSelects: Map<string, CustomSelectInputUI> = new Map();

  constructor(formConfig: FormConfig) {
    const { title, submitButtonText, fieldsData, onSubmit } = formConfig;

    this.formTitle = title;
    this.mode = "create";
    this.form = document.createElement("form");
    this.form.className = "form";
    this.form.dataset.mode = this.mode;

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

    // Store reference to CustomSelectInputUI instance for later use
    this.customSelects.set(fieldData.name, selectInput);
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

  private getFormData(event: Event) {
    event.preventDefault();
    const mode = this.form.dataset.mode || "create";
    const itemId = this.form.dataset.itemId;

    const data: Record<string, string> = {};
    data["mode"] = mode;

    if (itemId) {
      data["itemId"] = itemId;
    }

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

    if (mode === "edit") {
      this.resetToCreateMode();
    } else {
      this.reset();
    }
  }

  public editItem(item: any): void {
    if (item) {
      this.currentItemId = item.id;
      this.mode = "edit";
      this.form.dataset.mode = this.mode;
      this.form.dataset.itemId = this.currentItemId;
      this.populateFormForEdit(item);
    }

    const submitButton = this.form.querySelector(
      "[type='submit'] span"
    ) as HTMLSpanElement;
    if (submitButton) {
      submitButton.innerText = this.submitButtonText.replace("Add", "Update");
    }
  }

  public resetToCreateMode(): void {
    this.currentItemId = undefined;
    this.mode = "create";
    this.form.dataset.mode = "create";
    delete this.form.dataset.itemId;
    this.reset();

    const submitButton = this.form.querySelector('button[type="submit"] span');
    if (submitButton) {
      submitButton.textContent = this.submitButtonText;
    }
  }

  private populateFormForEdit(data: Record<string, any>): void {
    this.fieldsData.forEach(fieldData => {
      const input = this.form.elements.namedItem(
        fieldData.name
      ) as HTMLInputElement;

      if (input) {
        const value = data[fieldData.name];

        if (input.type === "hidden") {
          this.populateCustomSelectField(fieldData, value);
        } else {
          this.populateDefaultField(input, value);
        }
      }
    });
  }

  private populateCustomSelectField(fieldData: FormField, value: string): void {
    const customSelect = this.customSelects.get(fieldData.name);

    if (customSelect && value) {
      customSelect.setValue(value);
    }
  }

  private populateDefaultField(input: HTMLInputElement, value: string): void {
    if (input) {
      input.value = value || "";

      if (value) {
        const label = input
          .closest(".form__field")
          ?.querySelector(".form__field--label");
        if (label) {
          label.classList.remove("offscreen");
        }
      }
    }
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

    labels.forEach(label => label.classList.add("offscreen"));

    this.customSelects.forEach(customSelect => {
      customSelect.reset();
    });

    const colorLabels = this.form.querySelectorAll(".form__field--color label");
    colorLabels.forEach(label => label.classList.remove("offscreen"));

    this.form.reset();
    this.clearAllErrors();
  }
}
