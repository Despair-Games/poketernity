import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { allMoves } from "#data/data-lists";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Heal_Block_(move) | Heal Block's}
 * effects. Negates all healing on the target(s) and prevents
 * them from selecting or using healing moves.
 * @extends AddBattlerTagAttr
 */
export class HealBlockAttr extends AddBattlerTagAttr {
  constructor(isAttack: boolean = false, turnCount: number = 5) {
    super(BattlerTagType.HEAL_BLOCK, false, {
      failOnOverlap: !isAttack,
      turnCountMin: turnCount,
    });
  }

  /**
   * Grants 40%(+1), with an additional {@link MINOR_EFFECT_SCORE_BONUS | minor bonus}
   * if the target has any healing move.
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    if (target.hasTag(BattlerTagType.HEAL_BLOCK)) {
      // This should not affect score if the target is already Heal Blocked
      // and the move would not fail as a result (i.e. the move is Psychic Noise)
      return 0;
    }

    const hasTriageMove = target
      .getRevealedMoves()
      .some((moveId) => allMoves.get(moveId).checkFlag(MoveFlags.TRIAGE_MOVE, target));

    return this.getRandomScore(user, 40) + (hasTriageMove ? MINOR_EFFECT_SCORE_BONUS : 0);
  }
}
