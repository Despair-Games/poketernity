import type { ItemRarity } from "#enums/item-rarity";
import type { ItemId } from "#enums/ItemId";

export interface Item {
  readonly id: ItemId;
  readonly rarity: ItemRarity;
}

export interface Stackable {
  readonly stackCount: number;
  readonly maxStackCount: number;
}

export interface Purchaseable {
  readonly price: number;
}
