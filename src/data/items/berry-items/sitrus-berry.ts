import type { TurnEndContext } from "#app/data/items/base-item";
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

  //#region Getters/Setters

  public get isHolderHalfHpOrLess(): boolean {
    const holderHalfHp = this.holder.getMaxHp() / 2;
    return this.holder.getMaxHp() <= holderHalfHp;
  }

  //#endregion
  //#region Event Handlers

  /**
   * Upon eating the berry, the holder is healed by 25% of their max-hp
   * @override
   */
  public override onEat(): void {
    const healAmount = this.holder.getMaxHp() * SitrusBerry.HEAL_PERCENTAGE; // 25% of max-hp
    this.holder.heal(healAmount);
    // TODO: remove/delete berry
  }

  /**
   * Trigger eating the berry when the holder is half hp or less.
   * @override
   */
  public override onTurnEnd(context: TurnEndContext): void {
    super.onTurnEnd?.(context);
    if (this.isHolderHalfHpOrLess) {
      this.onEat();
    }
  }

  //#endregion
}
