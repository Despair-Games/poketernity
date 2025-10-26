import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

type TargetCondition = (source: Pokemon, target: Pokemon) => boolean;

export class FieldAccuracyMultiplierAbAttr extends AbAttr {
  protected override readonly abAttrKey = "FieldAccuracyMultiplierAbAttr";
  protected readonly multiplier: number;
  protected readonly targetCondition: TargetCondition;

  constructor(multiplier: number, targetCondition: TargetCondition = () => true) {
    super();

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
