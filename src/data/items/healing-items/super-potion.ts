import { HealingItem } from "#app/data/items/healing-items/healing-item";
import { ItemRarity } from "#enums/item-rarity";
import { ItemId } from "#enums/item-id";

export class SuperPotion extends HealingItem {
  constructor() {
    super({
      id: ItemId.SUPER_POTION,
      rarity: ItemRarity.GREAT,
      healAmount: 50,
      healPercentage: 0.25,
    });
  }
}
