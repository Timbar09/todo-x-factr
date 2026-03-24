export default class AnalyticRenderer {
  constructor() {}

  renderAnalyticView(container: HTMLElement): void {
    container.innerHTML = "";

    container.innerHTML = `
      <header class="main__view--content__header p-2">
        <h2 class="main__view--title">Analytics</h2>
      </header>

        <p class="px-2">Analytics coming soon!</p>
      `;
  }
}
