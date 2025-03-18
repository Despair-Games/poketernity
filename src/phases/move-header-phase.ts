import { applyMoveAttrs } from "#app/utils/move-utils";
import { MoveHeaderAttr } from "#app/data/moves/move-attrs/move-header-attr";
import { type Pokemon } from "#app/field/pokemon";
import { type PokemonMove } from "#app/field/pokemon-move";
import { PhaseId } from "#enums/phase-id";
import { BattlePhase } from "./abstract-battle-phase";

/**
 * Applies {@linkcode MoveHeaderAttr}s
 * @extends BattlePhase
 */
export class MoveHeaderPhase extends BattlePhase {
  override readonly id = PhaseId.MOVE_HEADER;
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
    super.start();

    if (this.canMove()) {
      applyMoveAttrs(MoveHeaderAttr, this.pokemon, null, this.move.getMove());
    }
    this.end();
  }
}
