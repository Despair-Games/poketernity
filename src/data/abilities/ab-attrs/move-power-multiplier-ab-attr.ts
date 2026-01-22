import { VariableMovePowerAbAttr } from "#abilities/variable-move-power-ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { VariableMovePowerAbAttrParams } from "#types/ab-attr-param-types";

type PowerMultiplierFunction = (user: Pokemon) => number;

/**
 * Abilities which cause a variable amount of power increase based on a given multiplier function.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Supreme_Overlord_(Ability) | Supreme Overlord (Bulbapedia)}
 * @param multFunc - A function which takes a `user` and returns a power multiplier.
 */
export class MovePowerMultiplierAbAttr extends VariableMovePowerAbAttr {
  private readonly multFunc: PowerMultiplierFunction;

  constructor(multFunc: PowerMultiplierFunction) {
    super();

    this.multFunc = multFunc;
  }

  public override apply({ pokemon, power }: VariableMovePowerAbAttrParams): void {
    power.value *= this.multFunc(pokemon);
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return this.multFunc(pokemon) !== 1;
  }
}
