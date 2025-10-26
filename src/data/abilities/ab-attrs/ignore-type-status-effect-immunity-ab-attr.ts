import { AbAttr } from "#abilities/ab-attr";
import type { ElementalType } from "#enums/elemental-type";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * If the defender is normally immune to a status effect due to its type, ignore that immunity.
 * Used by Corrosion
 */
export class IgnoreTypeStatusEffectImmunityAbAttr extends AbAttr {
  protected override readonly abAttrKey = "IgnoreTypeStatusEffectImmunityAbAttr";
  private readonly statusEffect: StatusEffect[];
  private readonly defenderType: ElementalType[];

  constructor(statusEffect: StatusEffect[], defenderType: ElementalType[]) {
    super();

    this.statusEffect = statusEffect;
    this.defenderType = defenderType;
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    cancelled: ValueHolder<boolean>,
    _effect: StatusEffect,
    _defType: ElementalType,
  ): void {
    cancelled.value = true;
  }

  public override canApply(...[, , , effect, defType]: Parameters<this["apply"]>): boolean {
    return this.statusEffect.includes(effect) && this.defenderType.includes(defType);
  }
}
