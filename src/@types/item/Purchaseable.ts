/**
 * An item that can be purchased
 */
export interface Purchaseable {
  /** The price of the item */
  readonly price: number;
  /** Called when the item is purchased */
  onPurchase(): void;
}
