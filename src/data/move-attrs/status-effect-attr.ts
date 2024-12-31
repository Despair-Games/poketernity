import { MoveCategory } from "#enums/move-category";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { ConfusionOnStatusEffectAbAttr } from "#app/data/ab-attrs/confusion-on-status-effect-ab-attr";
import { applyPostAttackAbAttrs } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class StatusEffectAttr extends MoveEffectAttr {
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

  /** Applies a non-volatile status condition to the target (or user if {@linkcode selfTarget} is `true`) */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, true);
    const statusCheck = moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance;
    if (statusCheck) {
      const pokemon = this.selfTarget ? user : target;
      if (pokemon.status) {
        if (this.overrideStatus) {
          pokemon.resetStatus();
        } else {
          return false;
        }
      }

      if (user !== target && target.isSafeguarded(user)) {
        if (move.category === MoveCategory.STATUS) {
          globalScene.queueMessage(
            i18next.t("moveTriggers:safeguard", { targetName: getPokemonNameWithAffix(target) }),
          );
        }
        return false;
      }
      if (
        (!pokemon.status || (pokemon.status.effect === this.effect && moveChance < 0))
        && pokemon.trySetStatus(this.effect, true, user, this.turnsRemaining)
      ) {
        applyPostAttackAbAttrs(ConfusionOnStatusEffectAbAttr, user, target, move, null, false, this.effect);
        return true;
      }
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
