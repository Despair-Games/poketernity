import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { StatusEffect } from "#enums/status-effect";
import type { Type } from "#enums/type";
import { AbAttr } from "./ab-attr";

/**
 * Ignores the type immunity to Status Effects of the defender if the defender is of a certain type
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
    if (this.statusEffect.includes(args[0] as StatusEffect) && this.defenderType.includes(args[1] as Type)) {
      cancelled.value = true;
      return true;
    }

    return false;
  }
}
