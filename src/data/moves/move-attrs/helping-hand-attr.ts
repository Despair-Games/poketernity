import { MAJOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import { isBetween } from "#utils/common-utils";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Helping_Hand_(move) | Helping Hand's} effect.
 * Boosts the power of the target ally's next attack this turn by 50%.
 * @extends AddBattlerTagAttr
 */
export class HelpingHandAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.HELPING_HAND, false);
  }

  /** @returns 0. The score for this effect is entirely implemented in {@linkcode getAllyTargetScore} */
  public override getRawEffectScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }

  /**
   * @returns a {@link MAJOR_EFFECT_SCORE_BONUS | major bonus} if the targeted ally
   * has an attack with a high {@linkcode Pokemon.getExpectedAttackScore | EAS} against at least one opponent,
   * but cannot KO any opponent with any of its attacks.
   *
   * **NOTE:** In this method, {@linkcode target} is assumed to be the user's ally.
   * this is guaranteed via Helping Hand's {@linkcode Move.moveTarget | target restriction}.
   */
  public override getAllyTargetScore(_user: EnemyPokemon, target: Pokemon, _move: Move): number {
    /** The target's highest EAS against any opposing Pokemon */
    const targetMaxEAS = Math.max(
      ...target
        .getOpponents()
        .map((opp) => Math.max(...target.getAttackMoves(true).map((mv) => target.getExpectedAttackScore(opp, mv)))),
    );

    if (isBetween(targetMaxEAS, 1, 2)) {
      return MAJOR_EFFECT_SCORE_BONUS;
    }
    return 0;
  }
}
