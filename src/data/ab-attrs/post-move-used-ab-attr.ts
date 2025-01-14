import type { BattlerIndex } from "#enums/battler-index";
import type { Pokemon } from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

/**
 * Triggers just after a move is used either by the opponent or the player
 * @extends AbAttr
 */
export class PostMoveUsedAbAttr extends AbAttr {
  applyPostMoveUsed(
    _pokemon: Pokemon,
    _move: PokemonMove,
    _source: Pokemon,
    _targets: BattlerIndex[],
    _simulated: boolean,
    ..._args: unknown[]
  ): boolean {
    return false;
  }
}
