import type { BattlerIndex } from "#enums/battler-index";
import type { Pokemon } from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

/**
 * Triggers just after a move is used either by the opponent or the player
 * @extends AbAttr
 */
export abstract class PostMoveUsedAbAttr extends AbAttr {
  /**
   * Applies an effect after a move is used by any other Pokemon
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param move The {@linkcode Move} being used
   * @param source The {@linkcode Pokemon} using the move
   * @param targets The targets of the move (by {@linkcode BattlerIndex})
   * @returns `true` if effects successfully apply
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _move: PokemonMove,
    _source: Pokemon,
    _targets: BattlerIndex[],
  ): boolean {
    return false;
  }
}
