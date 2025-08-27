export default abstract class ApplicationController<T> {
  protected items: T[] = [];
  protected static instances: Map<string, ApplicationController<any>> =
    new Map();

  protected constructor(protected storageKey: string) {
    this.loadFromStorage();
  }

  add(item: T): void {
    this.items.push(item);
    this.saveToStorage();
    this.dispatchEvent("added", item);
  }

  remove(id: string): void {
    const index = this.items.findIndex(item => this.getId(item) === id);
    if (index !== -1) {
      const removedItem = this.items.splice(index, 1)[0];
      this.saveToStorage();
      this.dispatchEvent("removed", removedItem);
    }
  }

  update(item: T): void {
    const index = this.items.findIndex(
      existing => this.getId(existing) === this.getId(item)
    );
    if (index !== -1) {
      this.items[index] = item;
      this.saveToStorage();
      this.dispatchEvent("updated", item);
    }
  }

  findById(id: string): T | undefined {
    return this.items.find(item => this.getId(item) === id);
  }

  // setAll(items: T[]): void {
  //   this.items = items;
  //   this.saveToStorage();
  // }

  // getAll(): T[] {
  //   return [...this.items];
  // }

  clear(): void {
    this.items = [];
    this.saveToStorage();
    this.dispatchEvent("cleared", null);
  }

  protected saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (error) {
      console.error(`Failed to save ${this.storageKey} to storage:`, error);
    }
  }

  protected loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);

        // console.log(`Type of Parsed ${this.storageKey}:`, typeof parsed);

        // console.log(`Loaded ${this.storageKey} from storage:`, parsed);
        this.items = this.deserializeItems(parsed);
      }
    } catch (error) {
      console.error(`Failed to load ${this.storageKey} from storage:`, error);
      this.items = [];
    }
  }

  // ✅ Event system
  protected dispatchEvent(action: string, data: T | null): void {
    const eventName = `${this.getControllerName()}${action.charAt(0).toUpperCase() + action.slice(1)}`;
    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {
          action,
          data,
          controller: this.getControllerName(),
        },
      })
    );
  }

  // ✅ Abstract methods that subclasses must implement
  protected abstract getId(item: T): string;
  protected abstract deserializeItems(items: any[]): T[];
  protected abstract getControllerName(): string;

  // ✅ Optional hooks for subclasses
  protected beforeAdd?(item: T): void;
  protected afterAdd?(item: T): void;
  protected beforeRemove?(item: T): void;
  protected afterRemove?(item: T): void;
  protected beforeUpdate?(item: T): void;
  protected afterUpdate?(item: T): void;
}
