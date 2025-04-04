import type { ItemRarity } from "#enums/item-rarity";
import type { ItemId } from "#enums/ItemId";

export interface Item {
  /** The id of the item */
  readonly id: ItemId;
  readonly rarity: ItemRarity;
}
