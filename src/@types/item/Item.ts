import { type ItemRarity } from "#enums/item-rarity";
import { type ItemCategory } from "#enums/item-category";
import { type ItemId } from "#enums/item-id";

/**
 * Base interface for all items
 */
export interface Item {
  /** The id of the item */
  readonly id: ItemId;
  /** The rarity of the item */
  readonly rarity: ItemRarity;
  /** The category of the item */
  readonly category: ItemCategory;
}
