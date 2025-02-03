import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { StatusEffect } from "#enums/status-effect";
import type { ElementalType } from "#enums/elemental-type";
import { AbAttr } from "./ab-attr";

/**
 * If the defender is normally immune to a status effect due to its type, ignore that immunity.
 * Used by Corrosion
 * @extends AbAttr
 */
export class IgnoreTypeStatusEffectImmunityAbAttr extends AbAttr {
  private readonly statusEffect: StatusEffect[];
  private readonly defenderType: ElementalType[];

  constructor(statusEffect: StatusEffect[], defenderType: ElementalType[]) {
    super(true);

    this.statusEffect = statusEffect;
    this.defenderType = defenderType;
  }

  override apply(
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
