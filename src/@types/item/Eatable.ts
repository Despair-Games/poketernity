/**
 * An item that can be eaten by a {@linkcode Pokemon}. (e.g. a {@linkcode BerryItem})
 */
export interface Eatable {
  /** Action to perform when the item is consumed */
  eat(): void;
}
