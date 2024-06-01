import CategoryList from "../model/CategoryList";
import FullList from "../model/FullList";
import ListItemTemplate from "./ListItemTemplate";

interface DOMList {
  ul: HTMLUListElement;
  clear(): void;
  render(fullList: FullList, categoryList: CategoryList): void;
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

  render(fullList: FullList, categoryList: CategoryList): void {
    this.clear();

    fullList.list.forEach((item) => {
      const li = new ListItemTemplate(item, fullList, categoryList, this)
        .element;
      this.ul.appendChild(li);
    });
  }
}
