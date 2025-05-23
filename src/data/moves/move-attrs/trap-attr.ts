import { STRONG_MATCHUP_SCORE_THRESHOLD } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to trap the target on the field.
 * Unlike {@linkcode BindingAttr | binding effects}, this effect does not
 * damage the target at the end of each turn and lasts indefinitely
 * (i.e. until the user leaves the field).
 * @extends AddBattlerTagAttr
 */
export class TrapAttr extends AddBattlerTagAttr {
  constructor(isAttack: boolean = false) {
    super(BattlerTagType.TRAPPED, false, {
      failOnOverlap: !isAttack,
      lastHitOnly: isAttack,
    });
  }

  /**
   * Grants 60%(+1) if the user has a {@link STRONG_MATCHUP_SCORE_THRESHOLD | strong matchup}
   * against all opponents.
   * @todo Should this only be granted in single battles?
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const userMatchupScores = user.getOpponents().map((opp) => user.getMatchupScore(opp));

    if (userMatchupScores.every((score) => score >= STRONG_MATCHUP_SCORE_THRESHOLD)) {
      return this.getRandomScore(user, 60);
    }

    return 0;
  }
}
