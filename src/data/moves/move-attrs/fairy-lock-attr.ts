import { MINOR_EFFECT_SCORE_BONUS } from "#app/constants/ai-constants";
import type { Move } from "#app/data/moves/move";
import { AddArenaTagAttr } from "#app/data/moves/move-attrs/add-arena-tag-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";

export class FairyLockAttr extends AddArenaTagAttr {
  constructor() {
    super(ArenaTagType.FAIRY_LOCK, ArenaTagRelativeSide.ALL, { turnCount: 2, failOnOverlap: true });
  }

  /**
   * Grants (+1) in double battles if both enemies have a favorable matchup
   * against the active player Pokemon
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (!globalScene.currentBattle.double) {
      return 0;
    }

    const isFavorableMatchup = user
      .getField()
      .filter((p) => p.isActive(true))
      .every((p) => p.getAverageMatchupScore() >= 4);

    return isFavorableMatchup ? MINOR_EFFECT_SCORE_BONUS : 0;
  }
}
