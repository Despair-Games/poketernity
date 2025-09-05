import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ATTACK_SCORE_HP_THRESHOLD, BAD_MOVE_PENALTY, MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { HitResult } from "#enums/hit-result";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute used for moves which cut the user's Max HP in half.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Mind_Blown_(move) | Mind Blown}
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Steel_Beam_(move) | Steel Beam}.
 */
export class HalfSacrificialAttr extends MoveEffectAttr {
  constructor() {
    super(true, { trigger: MoveEffectTrigger.POST_TARGET });
  }

  public override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const cancelled = new BooleanHolder(false);
    // Check to see if the Pokemon has an ability that blocks non-direct damage
    applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, user, false, cancelled);
    if (!cancelled.value) {
      user.damageAndUpdate(toDmgValue(user.getMaxHp() / 2), {
        result: HitResult.OTHER,
        ignoreSegments: true,
        preventEndure: true,
      });
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("moveTriggers:cutHpPowerUpMove", { pokemonName: getPokemonNameWithAffix(user) }),
      ); // Queue recoil message
    }
    return true;
  }

  /**
   * @returns An additional penalty for reducing the user's HP to go with the score
   * for this effect's stat stage changes. This checks each of the user's opponents'
   * max {@link Pokemon.getExpectedAttackScore | EAS} among their estimated attacks
   * to predict how much damage the user will receive this turn. If the user is
   * projected to receive enough damage to faint after applying this effect, this
   * grants a {@linkcode BAD_MOVE_PENALTY}. Boss Pokemon are always granted a (-10)
   * penalty from this effect and therefore should virtually never use moves with it.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (user.hasAbilityWithAttr(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE)) {
      return 0;
    }

    if (user.isBoss()) {
      return -10;
    }

    const oppMaxEas = user.getOpponents().map((opp) =>
      opp.estimateAttackMoves().reduce((maxEas, mv) => {
        const eas = opp.getExpectedAttackScore(user, mv);

        return Math.max(maxEas, eas);
      }, 0),
    );

    const meetsHpCutThreshold = oppMaxEas.every(
      (eas) => eas < ((user.getHpRatio() - 0.5) * 100) / ATTACK_SCORE_HP_THRESHOLD,
    );
    const hpCutPenalty = meetsHpCutThreshold ? MINOR_EFFECT_SCORE_PENALTY : BAD_MOVE_PENALTY;

    return hpCutPenalty;
  }
}
