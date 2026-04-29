import FormUI from "../../form";
import { formData } from "../../form/data";
import { FormConfig, DialogData } from "../../form/types";
import Controller from "../../../controller/CentralController";
import { FormHandler } from "./FormDialogHandler";
import DialogDom from "./FormDialogDom";
import { resolveEditItemController } from "./FormDialogItemResolver";
import { ViewType } from "../types";

export default class FormDialogManager {
  private main: HTMLElement;
  private dialog: HTMLElement;
  private form: FormUI | null;
  private controller: Controller;

  private formHandler: FormHandler;

  constructor(main: HTMLElement, controller: Controller) {
    this.main = main;
    this.controller = controller;
    this.dialog = DialogDom.getDialogContainerEl(this.main)!;
    this.form = null;

    this.formHandler = new FormHandler(controller);
  }

  setDialogContent(view: ViewType, formConfig: FormConfig): void {
    const dialogContent = DialogDom.getDialogContentEl(this.dialog);

    if (dialogContent) {
      dialogContent.innerHTML = "";

      this.dialog.dataset.dialog = view;
      DialogDom.setDialogStyle(this.dialog, view);

      formConfig.onSubmit = (data: DialogData) => {
        this.handleFormSubmit(view, data);
      };

      this.form = new FormUI(formConfig);
      this.form.renderInto(dialogContent);
    }
  }

  private handleFormSubmit(view: ViewType, formData: DialogData): void {
    const form = DialogDom.getFormEl(this.dialog)!;

    this.formHandler.handleSubmit(view, form, formData);

    this.dragDownDialog();
  }

  private dragUpDialog(): void {
    const dialog = DialogDom.getDialogContainerEl(this.main)!;
    const dialogElement = DialogDom.getDialogEl(this.dialog)!;
    const view = this.dialog.dataset.dialog as ViewType;

    DialogDom.dragUp(dialog, dialogElement);
    this.setDialogContent(view, formData[view]);
  }

  dragDownDialog(): void {
    const dialog = DialogDom.getDialogContainerEl(this.main)!;
    const dialogElement = DialogDom.getDialogEl(this.dialog)!;
    DialogDom.dragDown(dialog, dialogElement);
  }

  toggleDialog(): void {
    const isHidden = this.dialog.classList.contains("hidden");

    isHidden ? this.dragUpDialog() : this.dragDownDialog();
  }

  bindEvents(): void {
    const app = DialogDom.getAppEl();
    const toggleDialogButton = DialogDom.getToggleDialogButtonEl(this.dialog);

    if (toggleDialogButton) {
      toggleDialogButton.addEventListener("click", () => {
        this.toggleDialog();
      });
    }

    this.main.addEventListener("click", (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest(
        ".main__view--button"
      ) as HTMLElement | null;

      if (button && button.getAttribute("data-view")) {
        const view = button.getAttribute("data-view") as ViewType;

        this.setDialogContent(view, formData[view]);
        this.dragUpDialog();
      }
    });

    app?.addEventListener("click", event => {
      const target = event.target as HTMLElement;

      if (target.classList.contains("item__edit")) {
        const view = DialogDom.getDialogContainerEl(this.main)?.dataset.dialog;
        console.log("You clicked the edit button for:", view);

        const itemController = resolveEditItemController({
          view,
          target,
          controller: this.controller,
          onSetDialogContent: selectedView => {
            this.setDialogContent(selectedView, formData[selectedView]);
          },
        });

        if (!itemController) {
          console.warn(`The view "${view}" does not support item editing.`);
          return;
        }

        const item = itemController?.findById(target.dataset.itemId!);
        if (!item) return;

        this.dragUpDialog();
        this.form?.editItem(item);
      }
    });
  }
}
