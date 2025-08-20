/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { ChanceBasedMoveEffectAttr } from "#moves/chance-based-move-effect-attr";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MAJOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EffectiveStat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { isNil, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Heals user as a side effect of a move that hits a target.
 * Healing is based on {@linkcode healRatio} * the amount of damage dealt or a stat of the target.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Category:HP-draining_moves | HP-draining moves}
 */
export class HitHealAttr extends MoveEffectAttr {
  private healRatio: number;
  private healStat: EffectiveStat | null;

  constructor(healRatio?: number | null, healStat?: EffectiveStat) {
    super(true);

    this.healRatio = healRatio ?? 0.5;
    this.healStat = healStat ?? null;
  }

  /**
   * Heals the user the determined amount and possibly displays a message about regaining health.
   * If the target has the {@linkcode ReverseDrainAbAttr}, all healing is instead converted
   * to damage to the user.
   */
  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    let healAmount = 0;
    let message = "";
    const reverseDrain = target.hasAbilityWithAttr(AbAttrFlag.REVERSE_DRAIN, false);
    if (this.healStat !== null) {
      // Strength Sap formula
      healAmount = target.getEffectiveStat(this.healStat);
      message = i18next.t("battle:drainMessage", { pokemonName: getPokemonNameWithAffix(target) });
    } else {
      // Default healing formula used by draining moves like Absorb, Draining Kiss, Bitter Blade, etc.
      healAmount = toDmgValue(user.turnData.singleHitDamageDealt * this.healRatio);
      message = i18next.t("battle:regainHealth", { pokemonName: getPokemonNameWithAffix(user) });
    }
    if (reverseDrain) {
      if (user.hasAbilityWithAttr(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE)) {
        healAmount = 0;
        message = "";
      } else {
        healAmount *= -1;
        message = "";
      }
    }
    globalScene.phaseManager.createAndUnshiftPhase("PokemonHealPhase", user.getBattlerIndex(), healAmount, {
      message,
      showFullHpMessage: false,
      skipAnim: true,
    });
    return true;
  }

  /**
   * @returns An Effect Score modifier as follows:
   * - If any of the user's opponents has Liquid Ooze, grant a {@linkcode MAJOR_EFFECT_SCORE_PENALTY}.
   * - Otherwise, if the user is under the effects of Heal Block, grant no bonus.
   * - Otherwise, grant a bonus based on the expected HP restored by this move action.
   *   This bonus is "tiered" based on the expected heal ratio similarly to {@linkcode ChanceBasedMoveEffectAttr}'s scoring.
   *   Given expected heal ratio `H = 0.4m + c`, the resulting minimum score is `m`, and the chance to grant the maximum
   *   score `(m + 1)` is `(c / 0.4)`
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    if (user.getOpponents().some((opp) => opp.hasRevealedAbility(AbilityId.LIQUID_OOZE))) {
      return MAJOR_EFFECT_SCORE_PENALTY;
    }

    if (user.hasTag(BattlerTagType.HEAL_BLOCK)) {
      return 0;
    }

    const expectedDamage = !isNil(this.healStat)
      ? target.getEffectiveStat(this.healStat, { abilityApplyMode: AbilityApplyMode.REVEALED })
      : target.getAttackDamage(user, move, AbilityApplyMode.REVEALED, false, true).damage;
    const expectedHealRatio =
      Math.min(Math.floor(expectedDamage * this.healRatio), user.getInverseHp()) / user.getMaxHp();

    const healBonusThreshold = 0.4;
    const minScore = Math.floor(expectedHealRatio / healBonusThreshold);
    const tierUpChance = (expectedHealRatio % healBonusThreshold) / healBonusThreshold;

    return minScore + this.getRandomScore(user, tierUpChance);
  }
}
