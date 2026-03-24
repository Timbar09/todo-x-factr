/**
 * Abstract base class for all main-view UI classes.
 *
 * Provides the shared `container` element (#mainViewContent) and
 * enforces the `view()` contract so every subclass renders into the
 * same well-known DOM node without duplicating the look-up.
 */
export default abstract class AppUI {
  protected container: HTMLElement;

  constructor() {
    const el = document.getElementById("mainViewContent");
    if (!el) {
      throw new Error(
        'Required element "#mainViewContent" was not found in the DOM.'
      );
    }
    this.container = el;
  }

  /** Render the full view into `this.container`. */
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
