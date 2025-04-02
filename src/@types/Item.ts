import type { Pokemon } from "#app/field/pokemon";
import type { ItemRarity } from "#enums/item-rarity";
import type { ItemId } from "#enums/ItemId";

export interface Item {
  readonly id: ItemId;
  readonly price: number;
  readonly rarity: ItemRarity;

  get name(): string;
  get description(): string;

  /**
   * Event handler for when an item is picked up
   * @param pokemon The {@linkcode Pokemon} that picked up the item
   */
  readonly onPickup?: (pokemon: Pokemon) => void;
}
