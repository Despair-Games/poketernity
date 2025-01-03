import type { EffectiveStat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { toDmgValue } from "#app/utils";
import i18next from "i18next";
import { BlockNonDirectDamageAbAttr } from "#app/data/ab-attrs/block-non-direct-damage-ab-attr";
import { ReverseDrainAbAttr } from "#app/data/ab-attrs/reverse-drain-ab-attr";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Heals user as a side effect of a move that hits a target.
 * Healing is based on {@linkcode healRatio} * the amount of damage dealt or a stat of the target.
 * @extends MoveEffectAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Category:HP-draining_moves HP-draining moves}
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
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    let healAmount = 0;
    let message = "";
    const reverseDrain = target.hasAbilityWithAttr(ReverseDrainAbAttr, false);
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
      if (user.hasAbilityWithAttr(BlockNonDirectDamageAbAttr)) {
        healAmount = 0;
        message = "";
      } else {
        user.turnData.damageTaken += healAmount;
        healAmount = healAmount * -1;
        message = "";
      }
    }
    globalScene.unshiftPhase(new PokemonHealPhase(user.getBattlerIndex(), healAmount, message, false, true));
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
