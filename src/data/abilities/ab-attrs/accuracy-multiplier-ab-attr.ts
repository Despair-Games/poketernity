import { AbAttr } from "#abilities/ab-attr";
import type { AccuracyMultiplierAbAttrParams } from "#types/ab-attr-param-types";
import type { UserMoveConditionFunc } from "#types/move-types";

/**
 * Ability attribute that multiplies the accuracy of a subset of the source's moves.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Compound_Eyes_(Ability) | Compound Eyes (Bulbapedia)}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Hustle_(Ability) | Hustle (Bulbapedia)}
 */
export class AccuracyMultiplierAbAttr extends AbAttr {
  protected override readonly abAttrKey = "AccuracyMultiplierAbAttr";
  protected readonly multiplier: number;
  protected readonly condition: UserMoveConditionFunc;

  constructor(multiplier: number, condition: UserMoveConditionFunc = () => true) {
    super();

    this.multiplier = multiplier;
    this.condition = condition;
  }

  public override apply({ accuracyMultiplier }: AccuracyMultiplierAbAttrParams): void {
    accuracyMultiplier.value *= this.multiplier;
  }

  public override canApply({ pokemon, move }: Parameters<this["apply"]>[0]): boolean {
    return this.condition(pokemon, move);
  }
}
