import { BaseItem, type BaseItemInit } from "#app/data/items/base-item";
import { ItemCategory } from "#enums/item-category";

//#region Types

export interface KeyItemInit extends Omit<BaseItemInit, "category"> {
  subCategory: KeyItemSubCategory;
}

//#endregion

export abstract class KeyItem extends BaseItem {
  /** The subcategory of the key item */
  public readonly subCategory: KeyItemSubCategory;

  constructor({ id, rarity, subCategory }: KeyItemInit) {
    super({ id, rarity, category: ItemCategory.KEY_ITEM });
    this.subCategory = subCategory;
  }
}

export enum KeyItemSubCategory {
  UNCATEGORIZED,
  BADGE,
}
