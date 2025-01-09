import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

export class VariableMovePowerAbAttr extends PreAttackAbAttr {
  /**
   * Modifies a move's power when used by the source Pokemon
   * @param _pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @param _defender The {@linkcode Pokemon} targeted by the move
   * @param _move The {@linkcode Move} being used
   * @param _power A {@linkcode NumberHolder} containing the move's
   * power for the current turn
   * @returns `true` if this effect modified the move's power
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _defender: Pokemon,
    _move: Move,
    _power: NumberHolder,
  ): boolean {
    return false;
  }
}
