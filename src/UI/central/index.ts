export type ViewType = "home" | "templates" | "categories" | "analytics";

export default class CentralUI {
  static instance = new CentralUI();

  private currentView: ViewType = "home";
  private main: HTMLElement;
  private dragOutAppButton: HTMLElement;
  private app: HTMLElement;
  private appHeaderButton: HTMLElement;
  private navigation: HTMLElement;

  constructor() {
    this.main = document.getElementById("main")!;
    this.dragOutAppButton = this.main.querySelector("#dragOutAppButton")!;
    this.app = this.main.querySelector("#application")!;
    this.appHeaderButton = this.app.querySelector(".app__header--button")!;
    this.navigation = this.main.querySelector(".hero__nav")!;
    this.bindNavigationEvents();
  }

  private bindNavigationEvents(): void {
    this.dragOutAppButton.addEventListener("click", this.dragOutApp);

    const toggleAppDragButton = this.app.querySelector("#dragAppButton");
    if (toggleAppDragButton) {
      toggleAppDragButton.addEventListener("click", this.toggleAppDrag);
    }

    this.navigation.addEventListener("click", e => {
      const target = e.target as HTMLElement;

      if (target.closest(".hero__nav--button")) {
        const locationName = target
          .closest(".hero__nav--button")!
          .id.replace("NavButton", "");

        const location = locationName as ViewType;

        this.navigateTo(location);
        this.dragOutApp();
      }
    });
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
