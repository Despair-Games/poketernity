export interface Purchaseable {
  readonly price: number;

  onPurchase?(): void;
}
