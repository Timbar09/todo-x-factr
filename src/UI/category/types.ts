export interface Observer<T> {
  update(item: T): void;
}

export interface CategoryStats {
  numberOfItems: number;
  numberOfCompletedItems: number;
  completionPercentage: number;
}

export interface CategoryFormData {
  name: string;
  color: string;
}
