import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { StatusEffect } from "#enums/status-effect";
import type { Type } from "#enums/type";
import { AbAttr } from "./ab-attr";

/**
 * If the defender is normally immune to a status effect due to its type, ignore that immunity.
 * Used by Corrosion
 * @extends AbAttr
 */
export class IgnoreTypeStatusEffectImmunityAbAttr extends AbAttr {
  private statusEffect: StatusEffect[];
  private defenderType: Type[];

  constructor(statusEffect: StatusEffect[], defenderType: Type[]) {
    super(true);

    this.statusEffect = statusEffect;
    this.defenderType = defenderType;
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const effect: StatusEffect = args[0];
    const defType: Type = args[1];
    if (this.statusEffect.includes(effect) && this.defenderType.includes(defType)) {
      cancelled.value = true;
      return true;
    }

    return false;
  }
}
