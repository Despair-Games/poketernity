import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

type TargetCondition = (source: Pokemon, target: Pokemon) => boolean;

export class FieldAccuracyMultiplierAbAttr extends AbAttr {
  protected readonly multiplier: number;
  protected readonly targetCondition: TargetCondition;

  constructor(multiplier: number, targetCondition: TargetCondition = () => true) {
    super();
    this._flags.add(AbAttrFlag.FIELD_ACCURACY_MULTIPLIER);

    this.multiplier = multiplier;
    this.targetCondition = targetCondition;
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _target: Pokemon,
    accuracyMultiplier: ValueHolder<number>,
  ): void {
    accuracyMultiplier.value *= this.multiplier;
  }

  public override canApply(...[pokemon, , target]: Parameters<this["apply"]>): boolean {
    return this.targetCondition(pokemon, target);
  }
}
