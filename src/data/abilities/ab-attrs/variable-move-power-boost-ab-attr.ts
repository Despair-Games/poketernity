import { VariableMovePowerAbAttr } from "#abilities/variable-move-power-ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Abilities which cause a variable amount of power increase.
 * @param multFunc A function which takes the user, target, and move, and returns the power multiplier. `1` means no multiplier.
 * @param showAbility Whether to show the ability when it activates. Default `true`
 * @see {@link applyPreAttack}
 */
export class VariableMovePowerBoostAbAttr extends VariableMovePowerAbAttr {
  private readonly multFunc: (user: Pokemon, target: Pokemon, move: Move) => number;

  constructor(multFunc: (user: Pokemon, target: Pokemon, move: Move) => number) {
    super();
    this.multFunc = multFunc;
  }

  public override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    move: Move,
    defender: Pokemon,
    power: ValueHolder<number>,
  ): void {
    power.value *= this.multFunc(pokemon, defender, move);
  }

  public override canApply(...[pokemon, , move, defender]: Parameters<this["apply"]>): boolean {
    return this.multFunc(pokemon, defender, move) !== 1;
  }
}
