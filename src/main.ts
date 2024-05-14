import FullList from "./model/FullList";
import ListItem from "./model/ListItem";
import ListTemplate from "./templates/ListTemplate";

import "./css/style.css";

const initApp = (): void => {
  const fullList = FullList.instance;
  const listTemplate = ListTemplate.instance;

  const itemEntryForm = document.getElementById(
    "itemEntryForm"
  ) as HTMLFormElement;

  itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
    e.preventDefault();

    const itemInput = document.getElementById("newItem") as HTMLInputElement;
    const newEntryText: string = itemInput.value.trim();

    if (!newEntryText.length) return;

    const itemId: number = fullList.list.length
      ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
      : 1;

    const newItem = new ListItem(itemId.toString(), newEntryText);

    itemInput.value = "";

    fullList.addItem(newItem);
    listTemplate.render(fullList);
  });

  const clearItemsButton = document.getElementById(
    "clearItemsButton"
  ) as HTMLButtonElement;

  clearItemsButton.addEventListener("click", (): void => {
    fullList.clearList();
    listTemplate.clear();
  });

  fullList.load();
  listTemplate.render(fullList);
};

document.addEventListener("DOMContentLoaded", initApp);
