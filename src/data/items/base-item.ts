import type { Item } from "#app/@types/Item";
import type { ItemRarity } from "#enums/item-rarity";
import { ItemId } from "#enums/ItemId";
import { t } from "i18next";

export abstract class BaseItem implements Item {
  public readonly id: ItemId;
  public readonly rarity: ItemRarity;

  public get name(): string {
    return t(`item:${ItemId[this.id]}.name`);
  }

  public get description(): string {
    return t(`item:${ItemId[this.id]}.description`);
  }

  constructor({ id, rarity }: Item) {
    this.id = id;
    this.rarity = rarity;
  }
}
