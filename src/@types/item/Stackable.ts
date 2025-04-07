/**
 * An item that can be stacked
 */
export interface Stackable {
  /** The maximum number of times the item can be stacked */
  readonly maxStackCount: number;

  /** Called when an item is added to the stack */
  onAdd?(): void;
  /** Called when an item is removed from the stack */
  onRemove?(): void;
  /** Called when the maximum stack count is reached */
  onMax?(): void;
}
