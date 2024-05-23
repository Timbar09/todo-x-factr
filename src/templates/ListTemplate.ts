import FullList from "../model/FullList";

interface DOMList {
  ul: HTMLUListElement;
  clear(): void;
  render(fullList: FullList): void;
}

export default class ListTemplate implements DOMList {
  ul: HTMLUListElement;

  static instance: ListTemplate = new ListTemplate();

  private constructor() {
    this.ul = document.getElementById("listItems") as HTMLUListElement;
  }

  clear(): void {
    this.ul.innerHTML = "";
  }

  render(fullList: FullList): void {
    this.clear();

    fullList.list.forEach((item) => {
      const li = document.createElement("li") as HTMLLIElement;
      li.className = "app__task--list__item";
      const div = document.createElement("div") as HTMLDivElement;
      div.className = "app__task--list__item--checkbox";

      const checkbox = document.createElement("input") as HTMLInputElement;
      checkbox.type = "checkbox";
      checkbox.id = item.id;
      checkbox.tabIndex = 0;
      checkbox.checked = item.checked;
      div.appendChild(checkbox);

      checkbox.addEventListener("change", () => {
        item.checked = checkbox.checked;
        fullList.save();
      });

      const label = document.createElement("label") as HTMLLabelElement;
      label.htmlFor = item.id;

      const labelSpan = document.createElement("span") as HTMLElement;
      labelSpan.className = "app__task--list__item--text";
      labelSpan.textContent = item.item;
      label.appendChild(labelSpan);
      div.appendChild(label);
      li.appendChild(div);

      const buttonContainer = document.createElement("div") as HTMLDivElement;
      buttonContainer.className = "app__task--list__item--button-container";

      const button = document.createElement("button") as HTMLButtonElement;
      button.className = "app__task--list__item--button";
      button.tabIndex = 0;
      button.ariaLabel = "Delete item";

      const buttonIcon = document.createElement("span") as HTMLElement;
      buttonIcon.className = "material-symbols-outlined";
      buttonIcon.textContent = "delete";
      button.appendChild(buttonIcon);
      buttonContainer.appendChild(button);

      li.appendChild(buttonContainer);

      button.addEventListener("click", () => {
        fullList.removeItem(item.id);
        this.render(fullList);
      });

      this.ul.appendChild(li);
    });
  }
}
