import type { HealBlockTag } from "#app/data/battler-tags/heal-block-tag";
import { getStatusEffectHealText } from "#app/data/status-effect";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { HealingBoosterModifier } from "#app/modifier/modifier";
import { CommonAnimPhase } from "#app/phases/common-anim-phase";
import { NumberHolder } from "#app/utils";
import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { PhaseId } from "#enums/phase-id";
import { StatusEffect } from "#enums/status-effect";
import i18next from "i18next";

export interface PokemonHealPhaseOptions {
  message?: string;
  showFullHpMessage?: boolean;
  skipAnim?: boolean;
  revive?: boolean;
  healStatus?: boolean;
  preventFullHeal?: boolean;
  fullRestorePP?: boolean;
}

/**
 * @param battlerIndex - The {@linkcode BattlerIndex} of the pokemon to heal
 * @param hpHealed - The amount of HP to heal
 * @param message - (Optional) Alternate message to be displayed during the heal phase.
 * @param showFullHpMessage - If `true`, displays a message if the pokemon is already at full HP. Default `true`
 * @param skipAnim - If `true`, skips animations. Default `false`
 * @param revive - If `true`, will revive a fainted pokemon. Default `false`
 * @param healStatus - If `true`, will clear a pokemon's status effect. Default `false`
 * @param preventFullHeal - If `true`, will not allow healing beyond 1 less than the pokemon's max HP. Default `false`
 * @param fullRestorePP - If `true`, will restore the pokemon's moves to full PP. Default `false`
 */
export class PokemonHealPhase extends CommonAnimPhase {
  override readonly id = PhaseId.POKEMON_HEAL;

  private readonly hpHealed: number;
  private message?: string;
  private readonly showFullHpMessage: boolean;
  private readonly skipAnim: boolean;
  private readonly revive: boolean;
  private readonly healStatus: boolean;
  private readonly preventFullHeal: boolean;
  private readonly fullRestorePP: boolean;

  constructor(
    battlerIndex: BattlerIndex,
    hpHealed: number,
    {
      message,
      showFullHpMessage = true,
      skipAnim = false,
      revive = false,
      healStatus = false,
      preventFullHeal = false,
      fullRestorePP = false,
    }: PokemonHealPhaseOptions = {},
  ) {
    super(CommonAnim.HEALTH_UP, battlerIndex);

    this.hpHealed = hpHealed;
    this.message = message;
    this.showFullHpMessage = showFullHpMessage;
    this.skipAnim = skipAnim;
    this.revive = revive;
    this.healStatus = healStatus;
    this.preventFullHeal = preventFullHeal;
    this.fullRestorePP = fullRestorePP;
  }

  public override start(): void {
    if (!this.skipAnim && (this.revive || this.getPokemon().hp) && !this.getPokemon().isFullHp()) {
      super.start();
    } else {
      this.end();
    }
  }

  public override end(): void {
    const pokemon = this.getPokemon();

    if (!pokemon.isOnField() || (!this.revive && !pokemon.isActive())) {
      return super.end();
    }

    // TODO: This seems weird, why are we storing the message check way before we use it
    // (at which point it could be outdated)
    const hasMessage = !!this.message;
    const healOrDamage = !pokemon.isFullHp() || this.hpHealed < 0;
    const healBlock = pokemon.getTag<HealBlockTag>(BattlerTagType.HEAL_BLOCK);
    let lastStatusEffect = StatusEffect.NONE;

    if (healBlock && this.hpHealed > 0) {
      globalScene.phaseManager.queueMessagePhase(healBlock.onActivation(pokemon));
      // TODO: is this necessary?
      delete this.message;
      return super.end();
    } else if (healOrDamage) {
      const hpRestoreMultiplier = new NumberHolder(1);
      if (!this.revive) {
        globalScene.applyModifiers(HealingBoosterModifier, this.isPlayer, hpRestoreMultiplier);
      }

      const healAmount = new NumberHolder(Math.floor(this.hpHealed * hpRestoreMultiplier.value));
      if (healAmount.value < 0) {
        pokemon.damageAndUpdate(healAmount.value * -1);
        healAmount.value = 0;
      }

      // Prevent healing to full if specified (in case of healing tokens so Sturdy doesn't cause a softlock)
      if (this.preventFullHeal && pokemon.hp + healAmount.value >= pokemon.getMaxHp()) {
        healAmount.value = pokemon.getMaxHp() - pokemon.hp - 1;
      }

      if (healAmount.value > 0) {
        healAmount.value = pokemon.heal(healAmount.value);
      }

      if (pokemon.isPlayer()) {
        const { gameStats } = globalScene.gameData;
        if (healAmount.value > gameStats.highestHeal) {
          gameStats.highestHeal = healAmount.value;
        }
      }

      if (this.healStatus && !this.revive && pokemon.status) {
        lastStatusEffect = pokemon.getStatusEffect(true);
        pokemon.resetStatus();
      }

      if (this.fullRestorePP) {
        for (const move of this.getPokemon().getMoveset()) {
          if (move) {
            move.ppUsed = 0;
          }
        }
      }

      pokemon.updateInfo().then(() => super.end());
    } else if (this.healStatus && !this.revive && pokemon.hasNonVolatileStatusEffect(false, true)) {
      lastStatusEffect = pokemon.getStatusEffect(true);
      pokemon.resetStatus();
      pokemon.updateInfo().then(() => super.end());
    } else if (this.showFullHpMessage) {
      this.message = i18next.t("battle:hpIsFull", { pokemonName: getPokemonNameWithAffix(pokemon) });
    }

    if (this.message) {
      globalScene.phaseManager.queueMessagePhase(this.message);
    }

    if (this.healStatus && lastStatusEffect && !hasMessage) {
      globalScene.phaseManager.queueMessagePhase(
        getStatusEffectHealText(lastStatusEffect, getPokemonNameWithAffix(pokemon)),
      );
    }

    if (!healOrDamage && !lastStatusEffect) {
      super.end();
    }
  }
}
