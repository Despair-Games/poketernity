import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export abstract class PreAttackAbAttr extends AbAttr {
  /**
   * Applies an effect before the source moves
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param move The {@linkcode Move} being used
   * @param defender The {@linkcode Pokemon} targeted by the move
   * @param args Any additional parameters for this effect
   * @returns `true` if effects from this attribute apply successfully
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _move: Move,
    _defender?: Pokemon,
    ..._args: unknown[]
  ): boolean {
    return false;
  }
}
