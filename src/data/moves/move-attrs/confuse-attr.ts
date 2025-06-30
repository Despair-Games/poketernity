import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BAD_MOVE_PENALTY, MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveCategory } from "#enums/move-category";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * Attribute to {@link https://bulbapedia.bulbagarden.net/wiki/Confusion_(status_condition) | confuse}
 * the user or target.
 */
export class ConfuseAttr extends AddBattlerTagAttr {
  constructor(failOnOverlap: boolean = false, axeKick: boolean = false) {
    // Axe Kick has the odd mechanic of guranteeing 3 turns of confuse instead of 2
    const turnCountMin = axeKick ? 3 : 2;
    super(BattlerTagType.CONFUSED, false, {
      turnCountMin,
      turnCountMax: 5,
      failOnOverlap,
    });
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!this.selfTarget && target.isSafeguarded(user)) {
      if (move.category === MoveCategory.STATUS) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("moveTriggers:safeguard", { targetName: getPokemonNameWithAffix(target) }),
        );
      }
      return false;
    }

    return super.applyEffect(user, target, move);
  }

  /**
   * Grants (+1) if the target isn't under the effects of Safeguard.
   *
   * **NOTE:** Some moves only have a chance to confuse. For more information on
   * how this is accounted for:
   * @see {@linkcode getEffectScore}
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    if (target.isSafeguarded(user)) {
      /*
       * Status moves "fail" if this is the case, but since Safeguard is checked
       * in `applyEffect`, it needs to be accounted for here instead
       * of within the move's Condition Score calculation.
       * TODO: This can be removed if the Safeguard check is reorganized into a condition
       */
      return move.isStatusMove() ? BAD_MOVE_PENALTY : 0;
    }

    return MINOR_EFFECT_SCORE_BONUS;
  }
}
