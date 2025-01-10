import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PreAttackAbAttr extends AbAttr {
  /**
   * Applies an effect before the source moves
   * @param _pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @param _defender The {@linkcode Pokemon} targeted by the move
   * @param _move The {@linkcode Move} being used
   * @param _args Any additional parameters for this effect
   * @returns `true` if effects from this attribute apply successfully
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _defender: Pokemon | undefined,
    _move: Move,
    ..._args: unknown[]
  ): boolean {
    return false;
  }
}
