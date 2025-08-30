export type ViewType = "home" | "templates" | "categories" | "analytics";

export default class CentralUI {
  static instance = new CentralUI();

  private currentView: ViewType = "home";
  private main: HTMLElement;
  private dragOutAppButton: HTMLElement;
  private app: HTMLElement;
  private appHeaderButton: HTMLElement;
  private navButtons: NodeListOf<HTMLElement>;

  constructor() {
    this.main = document.getElementById("main")!;
    this.dragOutAppButton = this.main.querySelector("#dragOutAppButton")!;
    this.app = this.main.querySelector("#application")!;
    this.appHeaderButton = this.app.querySelector(".app__header--button")!;
    this.navButtons = this.main.querySelectorAll(".hero__nav--button")!;
    this.bindNavigationEvents();
  }

  private bindNavigationEvents(): void {
    this.dragOutAppButton.addEventListener("click", this.dragOutApp);

    const toggleAppDragButton = this.app.querySelector("#dragAppButton");
    if (toggleAppDragButton) {
      toggleAppDragButton.addEventListener("click", this.toggleAppDrag);
    }

    this.navButtons.forEach(navButton => {
      navButton.addEventListener("click", () => {
        const view = navButton.dataset.view as ViewType;

        if (view) {
          this.setActiveNavButton(navButton);
          this.navigateTo(view);
          this.dragOutApp();
        }
      });
    });
  }

  private setActiveNavButton(activeButton: HTMLElement): void {
    this.navButtons.forEach(btn => btn.classList.remove("active"));
    activeButton.classList.add("active");
  }

  navigateTo(view: ViewType): void {
    if (this.currentView === view) return;

    // Hide current view
    this.hideCurrentView();

    // Show new view
    this.showView(view);
    this.currentView = view;

    // Trigger view change event
    window.dispatchEvent(
      new CustomEvent("viewChanged", {
        detail: { from: this.currentView, to: view },
      })
    );
  }

  private hideCurrentView(): void {
    const currentViewElement = this.app.querySelector(
      `#${this.currentView}View`
    );
    if (currentViewElement) {
      currentViewElement.classList.add("hidden");
    }
  }

  private showView(view: ViewType): void {
    const viewElement = this.app.querySelector(`#${view}View`);
    if (viewElement) {
      viewElement.classList.remove("hidden");
    }

    // Trigger specific view initialization
    switch (view) {
      case "templates":
        this.initializeTemplatesView();
        break;
      case "categories":
        this.initializeCategoriesView();
        break;
      case "analytics":
        this.initializeAnalyticsView();
        break;
      case "home":
        this.initializeHomeView();
        break;
    }
  }

  private initializeTemplatesView(): void {
    this.createBackToHomeButton();
  }

  private initializeCategoriesView(): void {
    this.createBackToHomeButton();
  }

  private initializeAnalyticsView(): void {
    this.createBackToHomeButton();
  }

  private initializeHomeView(): void {
    this.createDragAppButton();
  }

  private createDragAppButton(): void {
    this.appHeaderButton.innerHTML = `
      <button
        id="dragAppButton"
        class="button button__round app__header--button"
        title="Drag in or out"
        aria-label="Drag in or out"
      >
        <span class="material-symbols-outlined"> drag_handle </span>
      </button>
    `;

    this.appHeaderButton
      .querySelector("#dragAppButton")!
      .addEventListener("click", () => {
        this.toggleAppDrag();
      });
  }

  private createBackToHomeButton(): void {
    this.appHeaderButton.innerHTML = `
      <button
        id="backToHome"
        class="button button__round app__view--back"
        title="Back to home"
        aria-label="Back to home"
      >
        <span class="material-symbols-outlined"> arrow_back </span>
      </button>
    `;

    this.appHeaderButton
      .querySelector("#backToHome")
      ?.addEventListener("click", () => {
        this.navigateTo("home");
        this.navButtons.forEach(btn => btn.classList.remove("active"));
      });
  }

  private dragOutApp = (): void => {
    this.app.classList.add("show");
  };

  // private dragInApp = (): void => {
  //   this.app.classList.remove("show");
  // };

  private toggleAppDrag = (): void => {
    this.app.classList.toggle("show");
  };

  getCurrentView(): ViewType {
    return this.currentView;
  }
}
