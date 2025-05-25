import { MINOR_EFFECT_SCORE_BONUS, SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { allMoves } from "#data/data-lists";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Magic_Coat_(move) | Magic Coat's} effect.
 * Reflects any {@linkcode MoveFlags.BOUNCEABLE | bounceable} move targeting
 * the user back to the attacker.
 * @extends AddBattlerTagAttr
 */
export class MagicCoatAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.MAGIC_COAT, true, { failOnOverlap: true });
  }

  /**
   * Grants (+1) for every 2 of the user's opponents' revealed and bounceable status moves.
   */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const bounceableMoveCount = user
      .getOpponents()
      .flatMap((opp) =>
        [...opp.waveData.revealedMoves].filter((moveId) => allMoves.get(moveId).checkFlag(MoveFlags.BOUNCEABLE, opp)),
      ).length;

    const uncappedScore = Math.floor(bounceableMoveCount / 2) * MINOR_EFFECT_SCORE_BONUS;

    return Math.min(uncappedScore, SOFT_EFFECT_SCORE_LIMIT);
  }
}
