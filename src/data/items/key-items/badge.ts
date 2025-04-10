import { KeyItem, KeyItemSubCategory } from "#app/data/items/key-items/key-item";
import { type ItemId } from "#enums/item-id";
import { ItemRarity } from "#enums/item-rarity";

//#region Types

export interface BadgeInit {
  readonly id: ItemId;
}

//#endregion

export abstract class Badge extends KeyItem {
  constructor({ id }: BadgeInit) {
    super({ id, rarity: ItemRarity.LUXURY, subCategory: KeyItemSubCategory.BADGE });
  }
}
