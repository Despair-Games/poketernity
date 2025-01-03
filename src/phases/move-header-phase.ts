import { applyMoveAttrs } from "#app/data/move";
import { MoveHeaderAttr } from "#app/data/move-attrs/move-header-attr";
import type { PokemonMove } from "#app/field/pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { BattlePhase } from "./battle-phase";

export class MoveHeaderPhase extends BattlePhase {
  public pokemon: Pokemon;
  public move: PokemonMove;

  constructor(pokemon: Pokemon, move: PokemonMove) {
    super();

    this.pokemon = pokemon;
    this.move = move;
  }

  canMove(): boolean {
    return this.pokemon.isActive(true) && this.move.isUsable(this.pokemon);
  }

  override start() {
    super.start();

    if (this.canMove()) {
      applyMoveAttrs(MoveHeaderAttr, this.pokemon, null, this.move.getMove());
    }
    this.end();
  }
}
