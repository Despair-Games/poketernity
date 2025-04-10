import type { StatusEffectAppliedContext } from "#app/data/items/base-item";
import { BerryItem } from "#app/data/items/berry-items/berry-item";
import type { Pokemon } from "#app/field/pokemon";
import { ItemId } from "#enums/item-id";
import { ItemRarity } from "#enums/item-rarity";
import { StatusEffect } from "#enums/status-effect";

export class CheriBerry extends BerryItem {
  public static readonly HEAL_PERCENTAGE = 0.25;

  constructor(holder: Pokemon) {
    super({
      id: ItemId.CHERI_BERRY,
      rarity: ItemRarity.COMMON,
      holder,
      flingDamage: 10,
    });
  }

  public override onEat(): void {
    if (this.holder.status?.statusEffect === StatusEffect.PARALYSIS) {
      this.holder.resetStatus();
    }
  }

  public override onStatusEffectApplied({ statusEffect }: StatusEffectAppliedContext): void {
    if (statusEffect === StatusEffect.PARALYSIS) {
      this.onEat();
    }
  }
}
