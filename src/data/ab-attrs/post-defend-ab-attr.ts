import type { Move } from "#app/data/move";
import { type Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostDefendAbAttr extends AbAttr {
  /**
   * Applies an effect after being affected by another Pokemon's move.
   * @param _pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @param _attacker The {@linkcode Pokemon} using the move
   * @param _move The {@linkcode Move} being used
   * @returns `true` if effects successfully apply
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _attacker: Pokemon, _move: Move): boolean {
    return false;
  }
}
