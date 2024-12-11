import type Move from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { VariableMovePowerAbAttr } from "./variable-move-power-ab-attr";

/**
 * Abilities which cause a variable amount of power increase.
 * @param mult A function which takes the user, target, and move, and returns the power multiplier. `1` means no multiplier.
 * @param showAbility Whether to show the ability when it activates.
 * @extends VariableMovePowerAbAttr
 * @see {@link applyPreAttack}
 */
export class VariableMovePowerBoostAbAttr extends VariableMovePowerAbAttr {
  private mult: (user: Pokemon, target: Pokemon, move: Move) => number;

  constructor(mult: (user: Pokemon, target: Pokemon, move: Move) => number, showAbility: boolean = true) {
    super(showAbility);
    this.mult = mult;
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
    const multiplier = this.mult(pokemon, defender, move);
    const power: NumberHolder = args[0];
    if (multiplier !== 1) {
      power.value *= multiplier;
      return true;
    }

    return false;
  }
}
