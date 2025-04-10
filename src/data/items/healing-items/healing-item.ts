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
  /** The absolute amount of hp the pokemon is healed by */
  public readonly healAmount: number;
  /** The relative amount of hp the pokemon is healed by (of the pokemon's max-hp) */
  public readonly healPercentage: number;

  constructor({ id, rarity, healAmount, healPercentage }: HealItemInit) {
    super({ id, rarity, category: ItemCategory.MEDICINE });

    this.healAmount = healAmount ?? 0;
    this.healPercentage = healPercentage;
  }

  /**
   * Upon consuming the item, the pokemon is healed by either the {@linkcode healAmount} or the {@linkcode healPercentage} (whichever is greater)
   * @param context The {@linkcode ConsumeContext}
   */
  public onConsume({ pokemon }: ConsumeContext): void {
    const heal = Math.max(this.healAmount, pokemon.getMaxHp() * this.healPercentage);

    pokemon.heal(heal);
    //TODO: remove/delete item
  }
}
