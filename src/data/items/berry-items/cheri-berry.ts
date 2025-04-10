import type { TurnEndContext } from "#app/data/items/base-item";
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

  //#region Getters/Setters

  /** Check if the holder has the {@linkcode StatusEffect.PARALYSIS} status */
  private get isHolderParalyzed(): boolean {
    return this.holder.status?.statusEffect === StatusEffect.PARALYSIS;
  }

  //#endregion
  //#region Event Handlers

  /**
   * Upon eating the berry, the holder healed of the {@linkcode StatusEffect.PARALYSIS} status
   * @override
   */
  public override onEat(): void {
    if (this.isHolderParalyzed) {
      this.holder.resetStatus();
    }
    //TODO: remove/delete berry
  }

  /**
   * Trigger eating the berry when the holder is paralyzed
   * @override
   * @see {@linkcode BerryItem.onTurnEnd}
   */
  public override onTurnEnd(context: TurnEndContext): void {
    super.onTurnEnd?.(context);
    if (this.isHolderParalyzed) {
      this.onEat();
    }
  }

  //#endregion
}
