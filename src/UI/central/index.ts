import Controller from "../../controller/CentralController";
import HomeUI from "../home";
import TaskUI from "../task";
import CategoryUI from "../category";
import TemplateUI from "../template";
import { formData } from "../form/data";
import FormDialog, { ViewType } from "./FormDialog";

export default class CentralUI {
  static instance = new CentralUI();

  private controller: Controller;
  private currentView: ViewType = "home";
  private isViewDraggedOut: boolean = false;
  private app: HTMLElement;
  private main: HTMLElement;
  private dragOutMainViewButton: HTMLElement;
  private mainHeaderButton: HTMLElement;
  private appHeaderNavButtons: NodeListOf<HTMLElement>;
  private render: CategoryUI | TemplateUI | TaskUI | HomeUI;
  private formDialog: FormDialog;

  constructor() {
    this.controller = Controller.instance;
    this.app = document.getElementById("app")!;
    this.main = this.app.querySelector("#main")!;
    this.dragOutMainViewButton = this.app.querySelector(
      "#dragOutMainViewButton"
    )!;
    this.appHeaderNavButtons = this.app.querySelectorAll(
      ".app__header--nav__button"
    )!;
    this.mainHeaderButton = this.main.querySelector(".main__header--button")!;
    this.render = new HomeUI();
    this.formDialog = new FormDialog(this.main, this.controller);
    this.showView(this.currentView);
    this.bindNavigationEvents();
  }

  private bindNavigationEvents(): void {
    this.dragOutMainViewButton.addEventListener("click", this.dragOutMainView);

    const toggleMainViewDragButton = this.app.querySelector("#dragAppButton");
    if (toggleMainViewDragButton) {
      toggleMainViewDragButton.addEventListener(
        "click",
        this.toggleMainViewDrag
      );
    }

    this.formDialog.bindEvents();

    this.appHeaderNavButtons.forEach(navButton => {
      navButton.addEventListener("click", () => {
        const view = navButton.dataset.view as ViewType;

        if (view) {
          this.setActiveNavButton(navButton);
          this.navigateTo(view);
          this.dragOutMainView();
        }
      });
    });
  }

  private setActiveNavButton(activeButton: HTMLElement): void {
    this.appHeaderNavButtons.forEach(btn => btn.classList.remove("active"));
    activeButton.classList.add("active");
  }

  navigateTo(view: ViewType): void {
    if (this.currentView === view) return;

    this.showView(view);
    this.currentView = view;
    this.formDialog.dragDownDialog();

    window.dispatchEvent(
      new CustomEvent("viewChanged", {
        detail: { from: this.currentView, to: view },
      })
    );
  }

  private showView(view: ViewType): void {
    view === "home"
      ? this.createToggleMainViewButton()
      : this.createBackToHomeButton();

    switch (view) {
      case "home":
        this.render = new HomeUI();
        break;
      case "tasks":
        this.render = new TaskUI();
        break;
      case "templates":
        this.render = new TemplateUI();
        break;
      case "categories":
        this.render = new CategoryUI(this.controller);
        break;
      default:
        console.warn(`The view "${view}" does not support item editing.`);
        return;
    }

    this.render.view();

    this.formDialog.setDialogContent(view, formData[view]);
  }

  private createToggleMainViewButton(): void {
    const inOrOut = this.isViewDraggedOut ? "in" : "out";

    this.mainHeaderButton.innerHTML = `
      <button
        id="toggleMainViewButton"
        class="button button__round main__header--button"
        title="Drag ${inOrOut} view"
        aria-label="Drag ${inOrOut} view"
      >
        <span class="material-symbols-outlined"> drag_handle </span>
      </button>
    `;

    this.mainHeaderButton
      .querySelector("#toggleMainViewButton")!
      .addEventListener("click", () => {
        this.toggleMainViewDrag();
      });
  }

  private createBackToHomeButton(): void {
    this.mainHeaderButton.innerHTML = `
      <button
        id="backToHome"
        class="button button__round app__view--back"
        title="Back to home view"
        aria-label="Back to home view"
      >
        <span class="material-symbols-outlined"> arrow_back </span>
      </button>
    `;

    this.mainHeaderButton
      .querySelector("#backToHome")
      ?.addEventListener("click", () => {
        this.navigateTo("home");
        this.appHeaderNavButtons.forEach(btn => btn.classList.remove("active"));
      });
  }

  private dragOutMainView = (): void => {
    this.main.classList.add("show");
    this.isViewDraggedOut = true;
    this.createToggleMainViewButton();
  };

  private dragInMainView = (): void => {
    this.main.classList.remove("show");
    this.isViewDraggedOut = false;
    this.createToggleMainViewButton();
  };

  private toggleMainViewDrag = (): void => {
    if (this.main.classList.contains("show")) {
      this.dragInMainView();
    } else {
      this.dragOutMainView();
    }
  };

  getCurrentView(): ViewType {
    return this.currentView;
  }
}
