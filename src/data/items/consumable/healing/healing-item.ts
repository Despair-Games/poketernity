import type { Item } from "#app/@types/Item";
import { ConsumableItem } from "#app/data/items/consumable/consumable-item";
import type { Pokemon } from "#app/field/pokemon";

interface HealItemInit extends Item {
  healAmount?: number;
  healPercentage: number;
}

export abstract class HealingItem extends ConsumableItem {
  public readonly healAmount: number;
  public readonly healPercentage: number;

  constructor(init: HealItemInit) {
    super(init);

    const { healAmount, healPercentage } = init;

    this.healAmount = healAmount ?? 0;
    this.healPercentage = healPercentage;
  }

  public override onConsume(pokemon: Pokemon): void {
    this.beforeConsume();
    const heal = Math.max(this.healAmount, pokemon.getMaxHp() * this.healPercentage);

    pokemon.heal(heal);
    this.afterConsume();
  }
}
