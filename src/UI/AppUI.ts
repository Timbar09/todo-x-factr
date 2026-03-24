export default abstract class AppUI {
  protected container: HTMLElement;
  protected listCount: number = 0;

  constructor() {
    const el = document.getElementById("mainViewContent");
    if (!el) {
      throw new Error(
        'Required element "#mainViewContent" was not found in the DOM.'
      );
    }
    this.container = el;
  }

  abstract view(): void;

  /**
   * Convenience helper – query a descendant of the current container.
   * Returns `null` when the element is not found (no throw).
   */
  protected getEl<T extends HTMLElement = HTMLElement>(
    selector: string
  ): T | null {
    return this.container.querySelector<T>(selector);
  }
}
