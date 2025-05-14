import type { Move } from "#app/data/moves/move";
import { AddArenaTagAttr } from "#app/data/moves/move-attrs/add-arena-tag-attr";
import { OneHitKOAttr } from "#app/data/moves/move-attrs/one-hit-ko-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon-move";
import { isBetween } from "#app/utils/common-utils";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";

export class GravityAttr extends AddArenaTagAttr {
  constructor() {
    super(ArenaTagType.GRAVITY, ArenaTagRelativeSide.ALL, { turnCount: 5, failOnOverlap: true });
  }

  /**
   * Grants 60%(+1) for each ally that either
   * - is a natural Ground-type Pokemon, or
   * - knows a move with less than 80% base accuracy
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const isBenefitMove = (pokemonMove: PokemonMove) => {
      const move = pokemonMove.getMove();
      return !move.hasAttr(OneHitKOAttr) && isBetween(move.accuracy, 0, 79);
    };

    const benefittingAllies = user
      .getField()
      .filter(
        (p) => p.isActive(true) && (p.isOfType(ElementalType.GROUND, false) || p.getMoveset().some(isBenefitMove)),
      );

    return benefittingAllies.map(() => this.getRandomScore(user, 60)).reduce((total, score) => total + score, 0);
  }
}
