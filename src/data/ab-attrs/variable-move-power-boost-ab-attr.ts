import type Move from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { VariableMovePowerAbAttr } from "./variable-move-power-ab-attr";

/**
 * Abilities which cause a variable amount of power increase.
 * @param multFunc A function which takes the user, target, and move, and returns the power multiplier. `1` means no multiplier.
 * @param showAbility Whether to show the ability when it activates. Default `true`
 * @extends VariableMovePowerAbAttr
 * @see {@link applyPreAttack}
 */
export class VariableMovePowerBoostAbAttr extends VariableMovePowerAbAttr {
  private readonly multFunc: (user: Pokemon, target: Pokemon, move: Move) => number;

  constructor(multFunc: (user: Pokemon, target: Pokemon, move: Move) => number, showAbility: boolean = true) {
    super(showAbility);
    this.multFunc = multFunc;
  }

  /**
   * @override
   */
  override applyPreAttack(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    defender: Pokemon,
    move: Move,
    args: any[],
  ): boolean {
    const multiplier = this.multFunc(pokemon, defender, move);
    const power: NumberHolder = args[0];
    if (multiplier !== 1) {
      power.value *= multiplier;
      return true;
    }

    return false;
  }
}
