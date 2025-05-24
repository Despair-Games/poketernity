import { MINOR_EFFECT_SCORE_BONUS, SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { allMoves } from "#data/data-lists";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Snatch_(move) | Snatch's} effect.
 * For the rest of the turn, the user steals the effects of
 * any {@linkcode MoveFlags.SNATCHABLE | snatchable} moves used by other Pokemon.
 * @extends AddBattlerTagAttr
 */
export class SnatchAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.SNATCHING, true, { failOnOverlap: true });
  }

  /**
   * Grants (+1) for every 2 of the user's opponents' revealed and snatchable status moves.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const snatchableMoveCount = user
      .getOpponents()
      .flatMap((opp) =>
        [...opp.waveData.revealedMoves].filter((moveId) => allMoves.get(moveId).checkFlag(MoveFlags.SNATCHABLE, opp)),
      ).length;

    const uncappedScore = Math.floor(snatchableMoveCount / 2) * MINOR_EFFECT_SCORE_BONUS;

    return Math.min(uncappedScore, SOFT_EFFECT_SCORE_LIMIT);
  }
}
