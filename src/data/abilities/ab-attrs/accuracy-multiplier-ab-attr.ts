import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { UserMoveConditionFunc } from "#types/move-types";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Ability attribute that multiplies the accuracy of a subset of the source's moves.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Compound_Eyes_(Ability) | Compound Eyes}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Hustle_(Ability) | Hustle}.
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

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _move: Move,
    accuracyMultiplier: ValueHolder<number>,
  ): void {
    accuracyMultiplier.value *= this.multiplier;
  }

  public override canApply(...[pokemon, , move]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, move);
  }
}
