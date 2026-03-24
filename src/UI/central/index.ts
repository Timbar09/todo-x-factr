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
  private mainView: HTMLElement;
  private dragOutMainViewButton: HTMLElement;
  private toggleViewButtonContainer: HTMLElement;
  private appHeaderNavButtons: NodeListOf<HTMLElement>;
  private render: CategoryUI | TemplateUI | TaskUI | HomeUI;
  private formDialog: FormDialog;

  constructor() {
    this.controller = Controller.instance;
    this.app = document.getElementById("app")!;
    this.mainView = this.getEl("#mainView")!;
    this.dragOutMainViewButton = this.getEl("#dragOutMainViewButton")!;
    this.appHeaderNavButtons = this.getEls(".app__header--nav__button")!;
    this.toggleViewButtonContainer = this.mainView.querySelector(
      ".main__view--toggle"
    )!;
    this.render = new HomeUI();
    this.formDialog = new FormDialog(this.mainView, this.controller);
    this.showView(this.currentView);
    this.bindNavigationEvents();
  }

  private bindNavigationEvents(): void {
    this.dragOutMainViewButton.addEventListener("click", this.dragOutMainView);

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

    this.toggleViewButtonContainer.innerHTML = `
      <button
        id="toggleMainViewButton"
        class="button button__round main__view--toggle__button"
        title="Drag ${inOrOut} view"
        aria-label="Drag ${inOrOut} view"
      >
        <span class="material-symbols-outlined"> drag_handle </span>
      </button>
    `;

    const logoForLargeScreens = document.createElement("img");
    logoForLargeScreens.classList.add("app__logo");
    logoForLargeScreens.src = "/public/logo.png";
    logoForLargeScreens.alt = "App Logo";

    this.toggleViewButtonContainer.appendChild(logoForLargeScreens);

    this.toggleViewButtonContainer
      .querySelector("#toggleMainViewButton")!
      .addEventListener("click", () => {
        this.toggleMainViewDrag();
      });
  }

  private createBackToHomeButton(): void {
    console.log("Creating back to home button");
    this.toggleViewButtonContainer.innerHTML = `
      <button
        id="backToHome"
        class="button button__round main__view--back"
        title="Back to home view"
        aria-label="Back to home view"
      >
        <span class="material-symbols-outlined"> arrow_back </span>
      </button>
    `;

    this.toggleViewButtonContainer
      .querySelector("#backToHome")
      ?.addEventListener("click", () => {
        this.navigateTo("home");
        this.appHeaderNavButtons.forEach(btn => btn.classList.remove("active"));
      });
  }

  private dragOutMainView = (): void => {
    const button: HTMLButtonElement | null =
      this.toggleViewButtonContainer.querySelector("button");

    this.mainView.classList.add("show");
    this.isViewDraggedOut = true;

    if (button) {
      button.title = "Drag in view";
    }
  };

  private dragInMainView = (): void => {
    const button: HTMLButtonElement | null =
      this.toggleViewButtonContainer.querySelector("button");

    this.mainView.classList.remove("show");
    this.isViewDraggedOut = false;

    if (button) {
      button.title = "Drag out view";
    }
  };

  private toggleMainViewDrag = (): void => {
    if (this.mainView.classList.contains("show")) {
      this.dragInMainView();
    } else {
      this.dragOutMainView();
    }
  };

  private getEl(selector: string): HTMLElement {
    const element: HTMLElement | null = this.app.querySelector(selector);
    if (!element) {
      throw new Error(`Element with selector "${selector}" not found.`);
    }
    return element;
  }

  private getEls(selector: string): NodeListOf<HTMLElement> {
    const elements: NodeListOf<HTMLElement> =
      this.app.querySelectorAll(selector);
    if (elements.length === 0) {
      throw new Error(`Elements with selector "${selector}" not found.`);
    }
    return elements;
  }

  getCurrentView(): ViewType {
    return this.currentView;
  }
}
