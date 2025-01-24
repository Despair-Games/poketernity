import { MoveCategory } from "#enums/move-category";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { ConfusionOnStatusEffectAbAttr } from "#app/data/ab-attrs/confusion-on-status-effect-ab-attr";
import { applyAbAttrs } from "#app/data/apply-ab-attrs";
import type { Move } from "#app/data/move";
import { ChanceBasedMoveEffectAttr } from "./chance-based-move-effect-attr";

/**
 * Attribute to add a non-volatile status condition to
 * the user or target, depending on {@linkcode selfTarget}.
 * @extends ChanceBasedMoveEffectAttr
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
    super(selfTarget, { effectChanceOverride: effectChanceOverride });

    this.effect = effect;
    this.turnsRemaining = turnsRemaining;
    this.overrideStatus = overrideStatus;
  }

  override canApply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (user !== target && target.isSafeguarded(user)) {
      if (move.category === MoveCategory.STATUS) {
        globalScene.queueMessage(i18next.t("moveTriggers:safeguard", { targetName: getPokemonNameWithAffix(target) }));
      }
      return false;
    }
    return super.canApply(user, target, move);
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    const pokemon = this.selfTarget ? user : target;
    if (pokemon.status) {
      if (this.overrideStatus) {
        pokemon.resetStatus();
      } else {
        return false;
      }
    }

    if (pokemon.trySetStatus(this.effect, true, user, this.turnsRemaining)) {
      applyAbAttrs(ConfusionOnStatusEffectAbAttr, user, false, target, move, this.effect);
      return true;
    }

    return false;
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, false);
    const score = moveChance < 0 ? -10 : Math.floor(moveChance * -0.1);
    const pokemon = this.selfTarget ? user : target;

    return !pokemon.status && pokemon.canSetStatus(this.effect, true, false, user) ? score : 0;
  }
}
