import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

export class VariableMovePowerAbAttr extends PreAttackAbAttr {
  /**
   * Modifies a move's power when used by the source Pokemon
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param move The {@linkcode Move} being used
   * @param defender The {@linkcode Pokemon} targeted by the move
   * @param power A {@linkcode NumberHolder} containing the move's
   * power for the current turn
   * @returns `true` if this effect modified the move's power
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _move: Move,
    _defender: Pokemon,
    _power: NumberHolder,
  ): boolean {
    return false;
  }
}
