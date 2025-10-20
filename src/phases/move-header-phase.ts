import type { Pokemon } from "#field/pokemon";
import type { PokemonMove } from "#field/pokemon-move";
import { MoveHeaderAttr } from "#moves/move-header-attr";
import { BattlePhase } from "#phases/base/battle-phase";
import { applyMoveAttrs } from "#utils/move-utils";

/**
 * Applies {@linkcode MoveHeaderAttr}s
 */
export class MoveHeaderPhase extends BattlePhase {
  public override readonly phaseName = "MoveHeaderPhase";

  public readonly pokemon: Pokemon;
  public readonly move: PokemonMove;

  constructor(pokemon: Pokemon, move: PokemonMove) {
    super();

    this.pokemon = pokemon;
    this.move = move;
  }

  public canMove(): boolean {
    return this.pokemon.isActive(true) && this.move.isUsable(this.pokemon);
  }

  public override start(): void {
    if (this.canMove()) {
      applyMoveAttrs(MoveHeaderAttr, this.pokemon, null, this.move.getMove());
    }
    this.end();
  }
}
