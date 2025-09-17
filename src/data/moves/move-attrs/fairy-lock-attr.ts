import { globalScene } from "#app/global-scene";
import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { AddArenaTagAttr } from "#moves/move-attrs/add-arena-tag-attr";

/**
 * Attribute to apply the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Fairy_Lock_(move) | Fairy Lock}.
 * Prevents all active Pokemon from fleeing or switching out during their next turn.
 * @extends AddArenaTagAttr
 */
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
