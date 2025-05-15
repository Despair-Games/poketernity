import type { ItemRarity } from "#enums/item-rarity";

export interface Item {
  readonly price: number;
  readonly rarity: ItemRarity;

  get name(): string;
  get description(): string;
}
