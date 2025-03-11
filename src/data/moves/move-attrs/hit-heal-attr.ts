import type { EffectiveStat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import i18next from "i18next";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Heals user as a side effect of a move that hits a target.
 * Healing is based on {@linkcode healRatio} * the amount of damage dealt or a stat of the target.
 * @extends MoveEffectAttr
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
        user.turnData.damageTaken += healAmount;
        healAmount = healAmount * -1;
        message = "";
      }
    }
    globalScene.queuePokemonHeal(true, user.getBattlerIndex(), healAmount, {
      message,
      showFullHpMessage: false,
      skipAnim: true,
    });
    return true;
  }

  /**
   * Used by the Enemy AI to rank an attack based on a given user
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @returns an integer. Higher means enemy is more likely to use that move.
   */
  override getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    if (this.healStat) {
      const healAmount = target.getEffectiveStat(this.healStat);
      return Math.floor(Math.max(0, Math.min(1, (healAmount + user.hp) / user.getMaxHp() - 0.33)) / user.getHpRatio());
    }
    return Math.floor(Math.max(1 - user.getHpRatio() - 0.33, 0) * (move.power / 4));
  }
}
