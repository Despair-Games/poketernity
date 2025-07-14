import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ElementalType } from "#enums/elemental-type";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";

/**
 * If the defender is normally immune to a status effect due to its type, ignore that immunity.
 * Used by Corrosion
 */
export class IgnoreTypeStatusEffectImmunityAbAttr extends AbAttr {
  private readonly statusEffect: StatusEffect[];
  private readonly defenderType: ElementalType[];

  constructor(statusEffect: StatusEffect[], defenderType: ElementalType[]) {
    super(true);
    this._flags.add(AbAttrFlag.IGNORE_TYPE_STATUS_EFFECT_IMMUNITY);

    this.statusEffect = statusEffect;
    this.defenderType = defenderType;
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    cancelled: BooleanHolder,
    effect: StatusEffect,
    defType: ElementalType,
  ): boolean {
    if (this.statusEffect.includes(effect) && this.defenderType.includes(defType)) {
      cancelled.value = true;
      return true;
    }

    return false;
  }
}
