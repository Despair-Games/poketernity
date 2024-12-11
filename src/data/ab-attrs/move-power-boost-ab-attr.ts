import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type Pokemon from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type Move from "../move";
import { VariableMovePowerAbAttr } from "./variable-move-power-ab-attr";

export class MovePowerBoostAbAttr extends VariableMovePowerAbAttr {
  private condition: PokemonAttackCondition;
  private powerMultiplier: number;

  constructor(condition: PokemonAttackCondition, powerMultiplier: number, showAbility: boolean = true) {
    super(showAbility);
    this.condition = condition;
    this.powerMultiplier = powerMultiplier;
  }

  override applyPreAttack(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    defender: Pokemon,
    move: Move,
    args: any[],
  ): boolean {
    if (this.condition(pokemon, defender, move)) {
      (args[0] as NumberHolder).value *= this.powerMultiplier;

      return true;
    }

    return false;
  }
}
