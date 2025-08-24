import { FormField, Options } from "./FormUI";

export default class CustomSelect {
  private select: HTMLElement;
  private fieldData: FormField;
  private options: Options[];
  private isOpen: boolean;
  private selectedIndex: number;

  constructor(fieldData: FormField) {
    this.select = document.createElement("div");
    this.select.className = "form__field--input__select";

    this.fieldData = fieldData;
    this.options = fieldData.options ? fieldData.options : [];
    this.isOpen = false;
    this.selectedIndex = -1;

    this.createSelect();
  }

  renderInTo(container: HTMLElement) {
    container.appendChild(this.select);
  }

  createSelect() {
    const button = this.createButton();
    const dropdown = this.createDropDown();
    const input = this.createInput();

    this.select.appendChild(button);
    this.select.appendChild(dropdown);
    this.select.appendChild(input);

    this.bindEvents();

    return this.select;
  }

  createButton() {
    const { name, placeholder } = this.fieldData;
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "form__select--custom__button form__field--input__placeholder-title";
    button.id = `${name}SelectButton`;
    button.setAttribute("data-placeholder", placeholder || "");

    button.setAttribute("role", "combobox");
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `${name}SelectDropdown`);
    button.setAttribute("aria-label", `${name}SelectLabel`);

    button.innerHTML = `
        <span class="form__select--custom__text">${placeholder}</span>

        <span
          class="material-symbols-outlined form__select--custom__icon"
        >
          keyboard_arrow_down
        </span>
    `;

    return button;
  }

  createDropDown() {
    const dropdown = document.createElement("ul");
    dropdown.className = "form__select--custom__dropdown";
    dropdown.setAttribute("role", "listbox");

    dropdown.innerHTML = this.options
      .map(option => {
        const value = option.value ? option.value : "";
        return `
          <li 
            class="form__select--custom__option" 
            role="option"
            aria-selected="false"
            tabindex="-1"
            data-value="${value}"
          >
            ${option.name}
          </li>
    `;
      })
      .join("");

    return dropdown;
  }

  createInput() {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = this.fieldData.name;
    input.id = `${this.fieldData.name}Select`;
    input.value = "";

    return input;
  }

  bindEvents() {
    this.select.addEventListener("click", e => {
      const target = e.target as HTMLElement;
      const button: HTMLElement | null = target.closest(
        ".form__select--custom__button"
      );
      const option: HTMLElement | null = target.closest(
        ".form__select--custom__option"
      );

      if (button) {
        this.toggle();
      }

      if (option) {
        const allOptions = this.select.querySelectorAll(
          ".form__select--custom__option"
        );
        const index = Array.from(allOptions).indexOf(option);

        this.selectOption(index);
      }
    });

    this.select.addEventListener("focusin", e => {
      const target = e.target as HTMLElement;
      const button: HTMLElement | null = target.closest(
        ".form__select--custom__button"
      );
      const icon = button?.querySelector(".material-symbols-outlined");

      if (button && icon && !this.isOpen) {
        icon.classList.add("animate");
      }
    });

    this.select.addEventListener("keydown", e => this.handleKeydown(e));

    // Close on outside click
    document.addEventListener("click", e => {
      const target = e.target as HTMLElement;

      if (!this.select.contains(target)) {
        this.close();
      }
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    if (this.isOpen) return;
    const button = this.select.querySelector(".form__select--custom__button");
    const icon = button?.querySelector(".material-symbols-outlined");

    if (!button) return;

    this.isOpen = true;
    button.setAttribute("aria-expanded", "true");
    button.classList.add("active");

    if (icon) {
      icon.classList.remove("animate");
    }
  }

  close() {
    if (!this.isOpen) return;
    const button = this.select.querySelector(".form__select--custom__button");
    const icon = button?.querySelector(".material-symbols-outlined");

    if (!button) return;

    this.isOpen = false;
    button.setAttribute("aria-expanded", "false");
    button.classList.remove("active");

    if (icon) {
      icon.classList.add("animate");
    }
  }

  selectOption(index: number, fromEdit: boolean = false) {
    if (index < 0 || index >= this.options.length) return;

    const allOptions = this.select.querySelectorAll(
      ".form__select--custom__option"
    );

    allOptions.forEach((opt, i) => {
      opt.setAttribute("aria-selected", i === index ? "true" : "false");
    });

    // Update display
    const button = this.select.querySelector(".form__select--custom__button");
    const option = button?.querySelector(".form__select--custom__text");
    const hiddenInput = this.select.querySelector(
      'input[type="hidden"]'
    ) as HTMLInputElement;
    const selectedText = this.options[index].name;
    const selectedValue = this.options[index].value;

    if (!button || !option || !hiddenInput) return;

    if (selectedText !== this.fieldData.placeholder) {
      const label = button.closest(".form__field--input__select")
        ?.previousElementSibling as HTMLElement;

      button.classList.remove("form__field--input__placeholder-title");
      if (label) {
        label.classList.remove("offscreen");
      }
    }

    option.textContent = selectedText;
    hiddenInput.value = selectedValue;
    this.selectedIndex = index;

    if (!fromEdit) {
      this.close();
    }

    // Announce to screen readers
    button.setAttribute("aria-label", `${selectedText} selected`);
  }

  setValue(value: string): void {
    const optionIndex = this.options.findIndex(
      option => option.value === value
    );

    if (optionIndex >= 0) {
      this.selectOption(optionIndex);
    }
  }

  getValue(): string {
    const hiddenInput = this.select.querySelector(
      'input[type="hidden"]'
    ) as HTMLInputElement;
    return hiddenInput?.value || "";
  }

  reset(): void {
    const button = this.select.querySelector(
      ".form__select--custom__button"
    ) as HTMLElement;
    const textSpan = button?.querySelector(
      ".form__select--custom__text"
    ) as HTMLElement;
    const hiddenInput = this.select.querySelector(
      'input[type="hidden"]'
    ) as HTMLInputElement;
    const label = this.select.previousElementSibling as HTMLElement;

    if (button && textSpan && hiddenInput) {
      textSpan.textContent = this.fieldData.placeholder || "";
      button.classList.add("form__field--input__placeholder-title");
      hiddenInput.value = "";
      this.selectedIndex = -1;

      if (label && label.classList.contains("form__field--label")) {
        label.classList.add("offscreen");
      }

      if (this.isOpen) {
        this.close();
      }

      const allOptions = this.select.querySelectorAll(
        ".form__select--custom__option"
      );
      allOptions.forEach(opt => opt.setAttribute("aria-selected", "false"));
    }
  }

  handleKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        } else if (this.selectedIndex >= 0) {
          this.selectOption(this.selectedIndex);
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        } else {
          this.navigateOption(1);
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (this.isOpen) {
          this.navigateOption(-1);
        }
        break;

      case "Escape":
        const button = this.select.querySelector(
          ".form__select--custom__button"
        ) as HTMLButtonElement;

        if (this.isOpen) {
          e.preventDefault();
          this.close();
        }
        button.focus();
        break;
    }
  }

  navigateOption(direction: number) {
    const options = this.select.querySelectorAll(
      ".form__select--custom__option"
    );
    const newIndex = Math.max(
      0,
      Math.min(this.options.length - 1, this.selectedIndex + direction)
    );

    // Remove focus from previous option
    if (this.selectedIndex >= 0) {
      options[this.selectedIndex].classList.remove("focused");
    }

    // Add focus to new option
    this.selectedIndex = newIndex;
    options[newIndex].classList.add("focused");
    options[newIndex].scrollIntoView({ block: "nearest" });
  }
}
