import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
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
  protected readonly multiplier: number;
  protected readonly condition: UserMoveConditionFunc;

  constructor(multiplier: number, condition: UserMoveConditionFunc = () => true) {
    super();
    this._flags.add(AbAttrFlag.ACCURACY_MULTIPLIER);

    this.multiplier = multiplier;
    this.condition = condition;
  }

  public override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    move: Move,
    accuracyMultiplier: ValueHolder<number>,
  ): boolean {
    if (this.condition(pokemon, move)) {
      accuracyMultiplier.value *= this.multiplier;
      return true;
    }
    return false;
  }
}
