import type { Move } from "#app/data/move";
import { type Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export abstract class PostDefendAbAttr extends AbAttr {
  /**
   * Applies an effect after being affected by another Pokemon's move.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param attacker The {@linkcode Pokemon} using the move
   * @param move The {@linkcode Move} being used
   * @returns `true` if effects successfully apply
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _attacker: Pokemon, _move: Move): boolean {
    return false;
  }
}
