import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { FieldAccuracyMultiplierAbAttrParams } from "#types/ab-attr-param-types";

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

  public override apply({ accuracyMultiplier }: FieldAccuracyMultiplierAbAttrParams): void {
    accuracyMultiplier.value *= this.multiplier;
  }

  public override canApply({ pokemon, target }: Parameters<this["apply"]>[0]): boolean {
    return this.targetCondition(pokemon, target);
  }
}
