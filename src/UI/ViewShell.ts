export interface ViewShellConfig {
  /**
   * Class(es) appended after "main__view--content" on the container element.
   * e.g. "main__view--tasks" or "main__view--templates px-2"
   */
  viewClass: string;

  /** Padding/spacing class(es) on the `<header>` element. Defaults to "p-2". */
  headerPadding?: string;

  /** Text rendered inside `<h2 class="main__view--title">`. */
  title: string;

  /** When provided, renders the standard "New …" action button in the header. */
  addButton?: {
    /** `id` attribute of the button element. */
    id: string;
    /** `aria-label` attribute. */
    ariaLabel: string;
    /** Visible label text rendered inside `<span>`. */
    text: string;
    /** `data-view` attribute value. */
    dataView: string;
  };

  /** Config for the `<ul>` that will hold dynamic list items. */
  list: {
    /** `id` attribute of the `<ul>`. */
    id: string;
    /** Class name(s) on the `<ul>`. */
    className: string;
    /**
     * When provided, wraps the `<ul>` inside a `<div>` with these class(es).
     * e.g. "task__list--container px-2"
     */
    wrapperClassName?: string;
  };
}

/**
 * Renders the standard view shell — header + empty list — into `container`,
 * then returns the `<ul>` element ready for population.
 *
 * Used by TaskRenderer, CategoryRenderer and TemplateRenderer to eliminate
 * the duplicated boilerplate across those three views.
 */
export function renderViewShell(
  container: HTMLElement,
  config: ViewShellConfig
): HTMLUListElement {
  const { viewClass, headerPadding = "p-2", title, addButton, list } = config;

  container.innerHTML = "";
  container.className = `main__view--content ${viewClass}`;

  const addButtonHTML = addButton
    ? `
        <div class="main__view--actions">
          <button
            id="${addButton.id}"
            aria-label="${addButton.ariaLabel}"
            class="button button__primary button__primary--bar main__view--button main__view--button__add"
            data-view="${addButton.dataView}"
          >
            <span>${addButton.text}</span>
            <span class="material-symbols-outlined">Add</span>
          </button>
        </div>`
    : "";

  const ulHTML = `<ul id="${list.id}" class="${list.className}"></ul>`;
  const listHTML = list.wrapperClassName
    ? `<div class="${list.wrapperClassName}">${ulHTML}</div>`
    : ulHTML;

  container.innerHTML = `
    <header class="main__view--content__header ${headerPadding}">
      <h2 class="main__view--title">${title}</h2>
      ${addButtonHTML}
    </header>
    ${listHTML}
  `;

  return container.querySelector(`#${list.id}`) as HTMLUListElement;
}
