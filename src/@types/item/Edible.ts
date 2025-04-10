/**
 * An item that can be eaten by a {@linkcode Pokemon}. (e.g. a {@linkcode BerryItem})
 */
export interface Edible {
  /** Event handler for them item being eaten */
  onEat(): void;
}
