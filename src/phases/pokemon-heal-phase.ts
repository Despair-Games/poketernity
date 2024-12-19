import type { BattlerIndex } from "#app/battle";
import { CommonAnim } from "#app/data/battle-anims";
import type { HealBlockTag } from "#app/data/battler-tags";
import { getStatusEffectHealText } from "#app/data/status-effect";
import { HitResult, type DamageResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { HealingBoosterModifier } from "#app/modifier/modifier";
import { HealAchv } from "#app/system/achv";
import { NumberHolder } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import i18next from "i18next";
import { CommonAnimPhase } from "./common-anim-phase";

export class PokemonHealPhase extends CommonAnimPhase {
  // TODO: Replace with named parameters pattern
  private readonly hpHealed: number;
  private message: string | null;
  private readonly showFullHpMessage: boolean;
  private readonly skipAnim: boolean;
  private readonly revive: boolean;
  private readonly healStatus: boolean;
  private readonly preventFullHeal: boolean;
  private readonly fullRestorePP: boolean;

  constructor(
    battlerIndex: BattlerIndex,
    hpHealed: number,
    message: string | null,
    showFullHpMessage: boolean,
    skipAnim: boolean = false,
    revive: boolean = false,
    healStatus: boolean = false,
    preventFullHeal: boolean = false,
    fullRestorePP: boolean = false,
  ) {
    super(battlerIndex, undefined, CommonAnim.HEALTH_UP);

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
    const healBlock = pokemon.getTag(BattlerTagType.HEAL_BLOCK) as HealBlockTag;
    let lastStatusEffect = StatusEffect.NONE;

    if (healBlock && this.hpHealed > 0) {
      globalScene.queueMessage(healBlock.onActivation(pokemon));
      this.message = null;
      return super.end();
    } else if (healOrDamage) {
      const hpRestoreMultiplier = new NumberHolder(1);
      if (!this.revive) {
        globalScene.applyModifiers(HealingBoosterModifier, this.isPlayer, hpRestoreMultiplier);
      }

      const healAmount = new NumberHolder(Math.floor(this.hpHealed * hpRestoreMultiplier.value));
      if (healAmount.value < 0) {
        pokemon.damageAndUpdate(healAmount.value * -1, HitResult.HEAL as DamageResult);
        healAmount.value = 0;
      }

      // Prevent healing to full if specified (in case of healing tokens so Sturdy doesn't cause a softlock)
      if (this.preventFullHeal && pokemon.hp + healAmount.value >= pokemon.getMaxHp()) {
        healAmount.value = pokemon.getMaxHp() - pokemon.hp - 1;
      }

      healAmount.value = pokemon.heal(healAmount.value);
      if (healAmount.value) {
        globalScene.damageNumberHandler.add(pokemon, healAmount.value, HitResult.HEAL);
      }

      if (pokemon.isPlayer()) {
        globalScene.validateAchvs(HealAchv, healAmount);
        const { gameStats } = globalScene.gameData;
        if (healAmount.value > gameStats.highestHeal) {
          gameStats.highestHeal = healAmount.value;
        }
      }

      if (this.healStatus && !this.revive && pokemon.status) {
        lastStatusEffect = pokemon.status.effect;
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
    } else if (this.healStatus && !this.revive && pokemon.status) {
      lastStatusEffect = pokemon.status.effect;
      pokemon.resetStatus();
      pokemon.updateInfo().then(() => super.end());
    } else if (this.showFullHpMessage) {
      this.message = i18next.t("battle:hpIsFull", { pokemonName: getPokemonNameWithAffix(pokemon) });
    }

    if (this.message) {
      globalScene.queueMessage(this.message);
    }

    if (this.healStatus && lastStatusEffect && !hasMessage) {
      globalScene.queueMessage(getStatusEffectHealText(lastStatusEffect, getPokemonNameWithAffix(pokemon)));
    }

    if (!healOrDamage && !lastStatusEffect) {
      super.end();
    }
  }
}
