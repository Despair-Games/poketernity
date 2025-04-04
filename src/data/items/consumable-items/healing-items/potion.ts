import { HealingItem } from "#app/data/items/consumable-items/healing-items/healing-item";
import { ItemRarity } from "#enums/item-rarity";
import { ItemId } from "#enums/ItemId";

export class Potion extends HealingItem {
  constructor() {
    super({
      id: ItemId.POTION,
      rarity: ItemRarity.COMMON,
      healAmount: 20,
      healPercentage: 0.1,
    });
  }
}
