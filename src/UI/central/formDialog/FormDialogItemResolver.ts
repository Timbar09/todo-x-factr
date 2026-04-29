import Controller from "../../../controller/CentralController";
import { ViewType } from "../types";

interface ItemController {
  findById: (id: string) => unknown;
}

interface ItemResolverInput {
  view: string | undefined;
  target: HTMLElement;
  controller: Controller;
  onSetDialogContent: (view: ViewType) => void;
}

export function resolveEditItemController({
  view,
  target,
  controller,
  onSetDialogContent,
}: ItemResolverInput): ItemController | null {
  switch (view) {
    case "home":
      return controller.task;
    case "tasks":
      return controller.task;
    case "templates":
      return controller.template;
    case "categories":
      return resolveCategoriesViewController(
        target,
        controller,
        onSetDialogContent
      );
    default:
      return null;
  }
}

function resolveCategoriesViewController(
  target: HTMLElement,
  controller: Controller,
  onSetDialogContent: (view: ViewType) => void
): ItemController | null {
  const isTask = target.closest(".task__item") !== null;

  if (!target.dataset.itemId) {
    console.warn("No item ID found on the clicked element.");
    return null;
  }

  if (isTask) {
    onSetDialogContent("tasks");
    return controller.task;
  }

  onSetDialogContent("categories");
  return controller.category;
}
