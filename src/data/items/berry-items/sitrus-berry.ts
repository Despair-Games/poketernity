import type { DamageReceivedContext } from "#app/data/items/base-item";
import { BerryItem } from "#app/data/items/berry-items/berry-item";
import type { Pokemon } from "#app/field/pokemon";
import { ItemId } from "#enums/item-id";
import { ItemRarity } from "#enums/item-rarity";

export class SitrusBerry extends BerryItem {
  public static readonly HEAL_PERCENTAGE = 0.25;

  constructor(holder: Pokemon) {
    super({
      id: ItemId.SITRUS_BERRY,
      rarity: ItemRarity.COMMON,
      holder,
      flingDamage: 10,
    });
  }

  public override eat(): void {
    const healAmount = this.holder.getMaxHp() * SitrusBerry.HEAL_PERCENTAGE; // 25% of max-hp
    this.holder.heal(healAmount);
    // TODO: remove/delete berry
  }

  public override onDamageReceived(_context: DamageReceivedContext): void {
    const halfHp = this.holder.getMaxHp() / 2;

    if (this.holder.getMaxHp() <= halfHp) {
      this.eat();
    }
  }
}
