import {
  MAJOR_EFFECT_SCORE_BONUS,
  MAJOR_EFFECT_SCORE_PENALTY,
  MINOR_EFFECT_SCORE_BONUS,
} from "#constants/ai-constants";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Attribute to split HP evenly between the user and target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Pain_Split_(move) | Pain Split}.
 */
export class HpSplitAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const hpValue = Math.floor((target.hp + user.hp) / 2);
    [user, target].forEach((p) => {
      if (p.hp < hpValue) {
        p.heal(hpValue - p.hp);
      } else if (p.hp > hpValue) {
        // Neither ignoring nor not ignoring the dynamax damage reduction is correct,
        // but there's no alternative to picking one of them.
        p.damageAndUpdate(p.hp - hpValue, { ignoreSegments: true });
      }
      p.updateInfo();
    });

    return true;
  }

  /**
   * @returns An Effect Score modifier as follows:
   * - If the expected HP gained from using this move is greater than a given {@linkcode scoringHpThreshold},
   * grant either a {@link MAJOR_EFFECT_SCORE_BONUS | major bonus} or a {@link MINOR_EFFECT_SCORE_BONUS | minor bonus}
   * depending on whether or not the user outspeeds the target.
   * - Otherwise, grant a {@link MAJOR_EFFECT_SCORE_PENALTY | major penalty}.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const relativeHpRatio = Math.min(target.hp - user.hp, user.getInverseHp()) / user.getMaxHp();
    const scoringHpThreshold = 0.3;

    if (!user.isFullHp() && relativeHpRatio >= scoringHpThreshold) {
      return user.outspeeds(target, true) ? MAJOR_EFFECT_SCORE_BONUS : MINOR_EFFECT_SCORE_BONUS;
    }

    return MAJOR_EFFECT_SCORE_PENALTY;
  }
}
