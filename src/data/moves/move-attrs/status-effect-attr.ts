/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { MultiStatusEffectAttr } from "#moves/multi-status-effect-attr";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { ConfusionOnStatusEffectAbAttr } from "#abilities/confusion-on-status-effect-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import {
  BURN_SYNERGY_ABILITIES,
  POISON_SYNERGY_ABILITIES,
  POISONING_SYNERGY_ABILITIES,
} from "#constants/ability-constants";
import { ALLY_TARGET_PENALTY, BAD_MOVE_PENALTY, MAJOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { MoveCategory } from "#enums/move-category";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { ChanceBasedMoveEffectAttr } from "#moves/chance-based-move-effect-attr";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * Attribute to add a non-volatile status condition to
 * the user or target, depending on {@linkcode selfTarget}.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Status_condition#Non-volatile_status | Non-volatile status conditions}
 */
export class StatusEffectAttr extends ChanceBasedMoveEffectAttr {
  public effect: StatusEffect;
  public turnsRemaining?: number;
  public overrideStatus: boolean = false;

  constructor(
    effect: StatusEffect,
    selfTarget?: boolean,
    turnsRemaining?: number,
    overrideStatus: boolean = false,
    effectChanceOverride?: number,
  ) {
    super(selfTarget, {
      effectChanceOverride: effectChanceOverride,
      overridesAllyTargetPenalty: true,
    });

    this.effect = effect;
    this.turnsRemaining = turnsRemaining;
    this.overrideStatus = overrideStatus;
  }

  public override canApply(user: Pokemon, target: Pokemon, move: Move, simulated: boolean = false): boolean {
    if (user !== target && target.isSafeguarded(user, simulated)) {
      if (move.category === MoveCategory.STATUS && !simulated) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("moveTriggers:safeguard", { targetName: getPokemonNameWithAffix(target) }),
        );
      }
      return false;
    }
    return super.canApply(user, target, move);
  }

  public override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    const pokemon = this.selfTarget ? user : target;
    if (pokemon.hasNonVolatileStatusEffect()) {
      if (this.overrideStatus) {
        pokemon.resetStatus();
      } else {
        return false;
      }
    }

    if (pokemon.trySetStatus(this.effect, true, user, this.turnsRemaining)) {
      applyAbAttrs<ConfusionOnStatusEffectAbAttr>(
        AbAttrFlag.CONFUSION_ON_STATUS_EFFECT,
        user,
        false,
        target,
        move,
        this.effect,
      );
      return true;
    }

    return false;
  }

  /**
   * @returns The output of {@linkcode getAllyTargetScore} when evaluating the move against the given user's
   * ally, or the chance-adjusted {@linkcode getRawEffectScore | raw Effect Score} otherwise.
   * This score is inverted for self-targeted effects (i.e. Rest).
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    if (target === user.getAlly()) {
      return this.getAllyTargetScore(user, target, move);
    }

    return (this.selfTarget ? -1 : 1) * super.getEffectScore(user, target, move);
  }

  /**
   * Computes the Effect Score from this attribute when targeting the user's ally.
   * This accounts for the ally's abilties, which may benefit from the ally being afflicted with
   * certain status effects. In these cases, the move is generally awarded a X%(+2) bonus, where
   * the bonus chance X reflects the damage per turn of the status effect.
   * @param user - The {@linkcode Pokemon} evaluating the move
   * @param ally - The user's ally
   * @param move - The {@linkcode Move} being evaluated
   * @returns The overriding Effect Score when targeting the given ally.
   */
  private getAllyTargetScore(user: EnemyPokemon, ally: Pokemon, move: Move): number {
    if (!move.isStatusMove() || !ally.canSetStatus(this.effect, true, this.overrideStatus, user)) {
      return ALLY_TARGET_PENALTY;
    }

    if (this.effect === StatusEffect.BURN && BURN_SYNERGY_ABILITIES.some((abId) => ally.hasAbility(abId))) {
      return this.getRandomScore(user, 80, MAJOR_EFFECT_SCORE_BONUS);
    }

    if (
      [StatusEffect.POISON, StatusEffect.TOXIC].includes(this.effect)
      && POISON_SYNERGY_ABILITIES.some((abId) => ally.hasAbility(abId))
    ) {
      /**
       * The chance to grant a bonus for poisoning the user's ally (with a status move).
       * {@link StatusEffect.TOXIC | Badly poisoning} an ally is less likely to grant a bonus
       * than {@link StatusEffect.POISON | poisoning} an ally.
       */
      const bonusChance = this.effect === StatusEffect.POISON ? 70 : 60;
      return this.getRandomScore(user, bonusChance, MAJOR_EFFECT_SCORE_BONUS);
    }

    return ALLY_TARGET_PENALTY;
  }

  /**
   * @returns The base Effect Score corresponding to this attribute's {@linkcode effect}.
   * @see {@linkcode getStatusEffectScore}
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    if (!target.canSetStatus(this.effect, true, this.overrideStatus, user)) {
      return move.isStatusMove() ? BAD_MOVE_PENALTY : 0;
    }
    return this.getStatusEffectScore(user, target, this.effect);
  }

  /**
   * @returns A base Effect Score depending on the given {@linkcode StatusEffect}:
   * - Poison and Toxic Poison grant (+1)/(+1.5) respectively. If the user has Poison Puppeteer or
   * Merciless, this bonus is increased to (+2)/(+2.5).
   * - Paralysis grants (+1) if the user outspeeds the target, and (+2) otherwise.
   * - Sleep and Freeze grant (+2.5) in all cases
   * - Burn grants (+2) if the target has a physical affinity (ATK > SPATK), and (+1) otherwise.
   *
   * @privateRemarks
   * This is organized here (and not in {@linkcode getRawEffectScore}) so that
   * {@linkcode MultiStatusEffectAttr} can reuse this method in its scoring.
   */
  protected getStatusEffectScore(user: EnemyPokemon, target: Pokemon, effect: StatusEffect): number {
    switch (effect) {
      case StatusEffect.POISON:
        return POISONING_SYNERGY_ABILITIES.some((abId) => user.hasAbility(abId)) ? 2 : 1;
      case StatusEffect.TOXIC:
        return POISONING_SYNERGY_ABILITIES.some((abId) => user.hasAbility(abId)) ? 2.5 : 1.5;
      case StatusEffect.PARALYSIS:
        return user.outspeeds(target, true) ? 1 : 2;
      case StatusEffect.SLEEP:
      case StatusEffect.FREEZE:
        return 2.5;
      case StatusEffect.BURN: {
        const effectiveStatOptions = {
          abilityApplyMode: AbilityApplyMode.REVEALED,
          simulated: true,
        };
        return target.getEffectiveStat(Stat.ATK, effectiveStatOptions)
          > target.getEffectiveStat(Stat.SPATK, effectiveStatOptions)
          ? 2
          : 1;
      }
      default:
        // This will cause a type error if more status effects are added in the future,
        // ensuring they are not forgotten to be accounted for.
        effect satisfies StatusEffect.NONE;
        return 0;
    }
  }
}
