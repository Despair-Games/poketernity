import type { Item } from "#app/@types/Item";
import { eventBus } from "#app/event-bus";
import type { ItemRarity } from "#enums/item-rarity";
import type { ItemId } from "#enums/ItemId";

export abstract class BaseItem implements Item {
  public abstract readonly id: ItemId;

  public readonly price: number;
  public readonly rarity: ItemRarity;
  public readonly stackCount: number;
  public readonly maxStackCount: number;

  public abstract get name(): string;

  public abstract get description(): string;

  public use() {
    eventBus.emit(`item/use`, this);
  }
}
