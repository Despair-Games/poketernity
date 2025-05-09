import type { Move } from "#app/data/moves/move";
import { AddArenaTagAttr } from "#app/data/moves/move-attrs/add-arena-tag-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
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
    const benefittingAllies = user
      .getField()
      .filter(
        (p) =>
          p.isActive(true)
          && (p.isOfType(ElementalType.GROUND, false)
            || p.getMoveset().some((mv) => mv.getMove().accuracy < 80 && mv.getMove().accuracy >= 0)),
      );

    return benefittingAllies.map(() => this.getRandomScore(user, 60)).reduce((total, score) => total + score, 0);
  }
}
