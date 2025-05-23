import type { ItemRarity } from "#enums/item-rarity";
import type { Item } from "#types/item";

export abstract class BaseItem implements Item {
  readonly price: number;
  readonly rarity: ItemRarity;
  public readonly stackCount: number;
  public readonly maxStackCount: number;

  abstract get name(): string;

  abstract get description(): string;
}
