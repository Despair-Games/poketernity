import type { Item } from "#app/@types/Item";
import type { ItemRarity } from "#enums/item-rarity";

export abstract class BaseItem implements Item {
  readonly price: number;
  readonly rarity: ItemRarity;
  public readonly stackCount: number;
  public readonly maxStackCount: number;

  abstract get name(): string;

  abstract get description(): string;
}
