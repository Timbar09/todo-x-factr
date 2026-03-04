import Controller from "../../controller/TemplateController";

export default class TemplateEvents {
  private controller: Controller;
  private menuContent: HTMLElement;
  private onRender: () => void;
  private onSelectTemplate: (templateId: string) => void;
  private isBound: boolean = false;

  constructor(
    controller: Controller,
    menuContent: HTMLElement,
    onRender: () => void,
    onSelectTemplate: (templateId: string) => void
  ) {
    this.controller = controller;
    this.menuContent = menuContent;
    this.onRender = onRender;
    this.onSelectTemplate = onSelectTemplate;
  }

  bindEvents(): void {
    if (this.isBound) return;
    this.isBound = true;

    this.bindTemplateActions();
    this.bindCustomEvents();
  }

  private bindTemplateActions(): void {
    this.menuContent.addEventListener("click", e => {
      const target = e.target as Element;

      // ✅ CRITICAL: Check for MoreMenu clicks first and let them bubble
      // const isMoreMenuClick = target.closest(".more__options");
      // if (isMoreMenuClick) {
      //   console.log(
      //     "MoreMenu click detected in TemplateUI - letting MoreMenuController handle it"
      //   );
      //   return;
      // }

      // Handle template selection
      const templateButton = target.closest(
        ".template__item--button"
      ) as HTMLButtonElement;
      if (templateButton) {
        const templateId = templateButton.dataset.template!;
        this.onSelectTemplate(templateId);
        return;
      }
    });
  }

  private bindCustomEvents(): void {
    // Listen for edit template events
    // window.addEventListener("editTemplate", (e: Event) => {
    //   const { templateId } = (e as CustomEvent).detail;
    //   this.dialog.editTemplate(templateId);
    // });

    window.addEventListener("templateAdded", (e: Event) => {
      const { data } = (e as CustomEvent).detail;
      this.onSelectTemplate(data.id);
    });

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
