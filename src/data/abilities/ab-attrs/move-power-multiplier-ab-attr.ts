import { VariableMovePowerAbAttr } from "#abilities/variable-move-power-ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

type PowerMultiplierFunction = (user: Pokemon) => number;

/**
 * Abilities which cause a variable amount of power increase based on a given multiplier function.
 * Used by {@link https://bulbapedia.bulbagarden.net/wiki/Supreme_Overlord_(Ability) | Supreme Overlord}.
 * @param multFunc - A function which takes a `user` and returns a power multiplier.
 */
export class MovePowerMultiplierAbAttr extends VariableMovePowerAbAttr {
  private readonly multFunc: PowerMultiplierFunction;

  constructor(multFunc: PowerMultiplierFunction) {
    super();

    this.multFunc = multFunc;
  }

  public override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    _move: Move,
    _defender: Pokemon,
    power: ValueHolder<number>,
  ): void {
    power.value *= this.multFunc(pokemon);
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return this.multFunc(pokemon) !== 1;
  }
}
