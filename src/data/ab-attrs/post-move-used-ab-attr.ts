import type { BattlerIndex } from "#app/battle";
import type { Pokemon } from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

/**
 * Triggers just after a move is used either by the opponent or the player
 * @extends AbAttr
 */
export class PostMoveUsedAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _move: PokemonMove,
    _source: Pokemon,
    _targets: BattlerIndex[],
    ..._args: unknown[]
  ): boolean {
    return false;
  }
}
