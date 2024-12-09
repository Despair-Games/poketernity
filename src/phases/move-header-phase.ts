import { applyMoveAttrs, MoveHeaderAttr } from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon";
import { BattlePhase } from "./battle-phase";

/** Applies {@linkcode MoveHeaderAttr}s */
export class MoveHeaderPhase extends BattlePhase {
  public pokemon: Pokemon;
  public move: PokemonMove;

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
      applyMoveAttrs(MoveHeaderAttr, this.pokemon, null, this.move.getMove()).then(() => this.end());
    } else {
      this.end();
    }
  }
}
