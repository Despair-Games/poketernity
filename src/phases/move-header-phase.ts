import { applyMoveAttrs, MoveHeaderAttr } from "#app/data/move";
import { type Pokemon, type PokemonMove } from "#app/field/pokemon";
import { BattlePhase } from "./abstract-battle-phase";

/**
 * Applies {@linkcode MoveHeaderAttr}s
 * @extends BattlePhase
 */
export class MoveHeaderPhase extends BattlePhase {
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
