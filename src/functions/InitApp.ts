import FullList from "../model/FullList";
import ListItem from "../model/ListItem";
import ListTemplate from "../templates/ListTemplate";
import CategoryList from "../model/CategoryList";
import CategoryItem from "../model/CategoryItem";
import CategorySelectionTemplate from "../templates/CategorySelectionTemplate";
import CategoryListTemplate from "../templates/CategoryListTemplate";

export default (): void => {
  const fullList = FullList.instance;
  const categoryList = CategoryList.instance;
  const listTemplate = ListTemplate.instance;
  const categoryOptionsTemplate = CategorySelectionTemplate.instance;
  const categoryListTemplate = CategoryListTemplate.instance;

  categoryListTemplate.render(categoryList);
  categoryOptionsTemplate.render(categoryList);

  const itemEntryForm = document.getElementById(
    "itemEntryForm"
  ) as HTMLFormElement;
  const categorySelectionBox = document.getElementById(
    "categoryButton"
  ) as HTMLButtonElement;

  itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
    e.preventDefault();

    const itemInput = document.getElementById("newItem") as HTMLInputElement;
    const newEntryText: string = itemInput.value.trim();

    const selectedCategory = categorySelectionBox.children[0].textContent;
    let updatedCategoryItem: CategoryItem | null = null;

    const itemId: string = crypto.randomUUID();

    if (selectedCategory && selectedCategory !== "Select category") {
      const category = categoryList.findCategoryByName(selectedCategory);

      if (!category) {
        return console.error("Category not found");
      }

      updatedCategoryItem = category;

      updatedCategoryItem.addItem(itemId);
      categoryList.updateCategory(updatedCategoryItem);
    }

    if (!newEntryText.length) return;

    const newItem = new ListItem(
      itemId,
      newEntryText,
      false,
      updatedCategoryItem?.id
    );

    itemInput.value = "";

    fullList.addItem(newItem);
    listTemplate.render(fullList, categoryList);
  });

  const clearItemsButton = document.getElementById(
    "clearItemsButton"
  ) as HTMLButtonElement;
  const clearCompletedButton = document.getElementById(
    "clearCompletedItemsButton"
  ) as HTMLButtonElement;

  clearItemsButton.addEventListener("click", (): void => {
    fullList.clearList();
    categoryList.categories.forEach((category) => {
      category.clearItems();
      categoryList.updateCategory(category);
    });
    listTemplate.clear();
  });

  clearCompletedButton.addEventListener("click", (): void => {
    categoryList.categories.forEach((category) => {
      fullList.list.forEach((item) => {
        if (item.checked) {
          category.removeItem(item.id);
        }
      });
      categoryList.updateCategory(category);
    });
    fullList.ClearCompleted();
    listTemplate.render(fullList, categoryList);
  });

  fullList.load();
  listTemplate.render(fullList, categoryList);
};
