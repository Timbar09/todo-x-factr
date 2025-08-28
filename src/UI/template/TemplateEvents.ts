import Controller from "../../controller/TemplateController";
import TemplateDialog from "./TemplateDialog";

export default class TemplateEvents {
  private controller: Controller;
  private menuContent: HTMLElement;
  private dialog: TemplateDialog;
  private onRender: () => void;
  private onSelectTemplate: (templateId: string) => void;

  constructor(
    controller: Controller,
    menuContent: HTMLElement,
    dialog: TemplateDialog,
    onRender: () => void,
    onSelectTemplate: (templateId: string) => void
  ) {
    this.controller = controller;
    this.menuContent = menuContent;
    this.dialog = dialog;
    this.onRender = onRender;
    this.onSelectTemplate = onSelectTemplate;
  }

  bindEvents(): void {
    this.bindTemplateActions();
    this.bindDialogEvents();
    this.bindGlobalEvents();
    this.bindCustomEvents();
  }

  private bindTemplateActions(): void {
    this.menuContent.addEventListener("click", e => {
      const target = e.target as Element;

      // ✅ CRITICAL: Check for MoreMenu clicks first and let them bubble
      const isMoreMenuClick = target.closest(".more__options");
      if (isMoreMenuClick) {
        console.log(
          "MoreMenu click detected in TemplateUI - letting MoreMenuController handle it"
        );
        return;
      }

      // Handle template selection
      const templateButton = target.closest(
        ".template__item--button"
      ) as HTMLButtonElement;
      if (templateButton) {
        const templateId = templateButton.dataset.template!;
        this.onSelectTemplate(templateId);
        return;
      }

      // Handle add custom template button
      const addButton = target.closest(
        "#addCustomTemplate"
      ) as HTMLButtonElement;
      if (addButton) {
        e.stopPropagation();
        this.dialog.openDialog();
        return;
      }
    });
  }

  private bindDialogEvents(): void {
    // Drag up custom template dialog
    const customDialogDragHandle = this.dialog
      .getDialog()
      .querySelector(".template__dialog--button__toggle") as HTMLButtonElement;

    if (customDialogDragHandle) {
      customDialogDragHandle.addEventListener("click", e => {
        e.stopPropagation();
        this.dialog.toggleDialog();
      });
    }
  }

  private bindGlobalEvents(): void {
    // Listen for template changes
    window.addEventListener("templateChanged", () => {
      this.onRender();
    });

    // Listen for menu close event
    window.addEventListener("menuClosed", () => {
      this.dialog.closeDialog();
    });

    // Listen for menu already open event
    window.addEventListener("menuAlreadyOpen", () => {
      this.dialog.closeDialog();
    });
  }

  private bindCustomEvents(): void {
    // Listen for edit template events
    // window.addEventListener("editTemplate", (e: Event) => {
    //   const { templateId } = (e as CustomEvent).detail;
    //   this.dialog.editTemplate(templateId);
    // });

    // Listen for delete template events
    window.addEventListener("deleteTemplate", (e: Event) => {
      const { templateId } = (e as CustomEvent).detail;
      this.handleDeleteTemplate(templateId);
    });
  }

  private handleDeleteTemplate(templateId: string): void {
    const template = this.controller.findById(templateId);
    if (!template || template.default) return;

    const confirmMessage = `Delete "${template.name}" template?`;

    if (confirm(confirmMessage)) {
      const defaultTemplate = this.controller.list.find(t => t.default);

      this.controller.removeTemplate(templateId);

      if (template.active && defaultTemplate) {
        this.onSelectTemplate(defaultTemplate.id);
      }

      this.onRender();
    }
  }
}
