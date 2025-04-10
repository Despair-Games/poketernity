/**
 * An item that can be eaten by a {@linkcode Pokemon}. (e.g. a {@linkcode BerryItem})
 */
export interface Edible {
  /** Action to perform when the item is consumed */
  eat(): void;
}
