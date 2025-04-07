import type { Consumable, ConsumeContext } from "#app/@types/item/Consumable";
import { BaseItem, type BaseItemInit } from "#app/data/items/base-item";
import { ItemCategory } from "#enums/item-category";

//#region Types

interface HealItemInit extends Omit<BaseItemInit, "category"> {
  healAmount?: number;
  healPercentage: number;
}

//#endregion

export abstract class HealingItem extends BaseItem implements Consumable {
  public readonly healAmount: number;
  public readonly healPercentage: number;

  constructor({ id, rarity, healAmount, healPercentage }: HealItemInit) {
    super({ id, rarity, category: ItemCategory.MEDICINE });

    this.healAmount = healAmount ?? 0;
    this.healPercentage = healPercentage;
  }

  public onConsume({ pokemon }: ConsumeContext): void {
    const heal = Math.max(this.healAmount, pokemon.getMaxHp() * this.healPercentage);

    pokemon.heal(heal);
  }
}
