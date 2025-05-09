import { MINOR_EFFECT_SCORE_BONUS } from "#app/constants/ai-constants";
import type { Move } from "#app/data/moves/move";
import { AddArenaTagAttr } from "#app/data/moves/move-attrs/add-arena-tag-attr";
import { ProtectAttr } from "#app/data/moves/move-attrs/protect-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";

export class WishAttr extends AddArenaTagAttr {
  constructor() {
    super(ArenaTagType.WISH, ArenaTagRelativeSide.USER, { turnCount: 2, failOnOverlap: true });
  }

  /**
   * Grants a base effect score of 40%(+1), with some bonuses:
   * - (+1) if the user is damaged
   * - (+1) if the user knows Protect or any of its variants
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    let totalScore = this.getRandomScore(user, 40);

    if (!user.isFullHp()) {
      totalScore += MINOR_EFFECT_SCORE_BONUS;
    }

    if (user.getMoveset().some((mv) => mv.getMove().hasAttr(ProtectAttr))) {
      totalScore += MINOR_EFFECT_SCORE_BONUS;
    }

    return totalScore;
  }
}
