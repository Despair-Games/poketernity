import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * Attribute to apply the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Perish_Song_(move) | Perish Song}.
 * @extends AddBattlerTagAttr
 */
export class FaintCountdownAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.PERISH_SONG, false, {
      failOnOverlap: true,
      turnCountMin: 4,
      overridesAllyTargetPenalty: true,
    });
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.applyEffect(user, target, move)) {
      return false;
    }

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:faintCountdown", {
        pokemonName: getPokemonNameWithAffix(target),
        turnCount: this.turnCountMin - 1,
      }),
    );

    return true;
  }

  /**
   * Grants a {@link MINOR_EFFECT_SCORE_BONUS | minor bonus} if the target is trapped by any effect.
   * If the target is allied to the user, this bonus is multiplied by -1.
   * @todo `allyTargetMultiplier` should be used more widely for multi-target moves
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const allyTargetMultiplier = target.isOpponent(user) ? 1 : -1;
    return allyTargetMultiplier * (target.isTrapped() ? MINOR_EFFECT_SCORE_BONUS : 0);
  }
}
