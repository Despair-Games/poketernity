import type { StatusEffect } from "#enums/status-effect";
import { PlayerPokemon, type Pokemon } from "#app/field/pokemon";
import { randSeedItem } from "#app/utils";
import type { Move } from "#app/data/move";
import { StatusEffectAttr } from "#app/data/move-attrs/status-effect-attr";
import { globalScene } from "#app/global-scene";

/**
 * Attribute to randomly apply one of a {@linkcode effects | set of status effects}
 * on all opponents
 * G-Max Befuddle - [Poison, Sleep, Paralysis]
 * G-Max Volt Crash - Paralysis
 * G-Max Malodor - Poison
 * G-Max Stun Shock - [Poison, Paralysis] (can be different status for each opponent)
 *
 * @extends StatusEffectAttr
 */
export class MultiStatusAllOppsEffectAttr extends StatusEffectAttr {
  public effects: StatusEffect[];
  public sameStatus: boolean;

  constructor(
    effects: StatusEffect[],
    sameStatus: boolean = false,
    selfTarget?: boolean,
    turnsRemaining?: number,
    overrideStatus?: boolean,
  ) {
    super(effects[0], selfTarget, turnsRemaining, overrideStatus);
    this.effects = effects;
    this.sameStatus = sameStatus;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    this.effect = randSeedItem(this.effects);
    let result = false;

    let allOpps: Pokemon[];
    if (target instanceof PlayerPokemon) {
      allOpps = globalScene.getPlayerField();
    } else {
      allOpps = globalScene.getEnemyField();
    }
    allOpps = allOpps.filter((p) => p.isActive);

    allOpps.forEach((opp) => {
      if (!this.sameStatus) {
        this.effect = randSeedItem(this.effects);
      }
      result = result || super.apply(user, opp, move);
    });
    return result;
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, false);
    const score = moveChance < 0 ? -10 : Math.floor(moveChance * -0.1);
    const pokemon = this.selfTarget ? user : target;

    return !pokemon.status && pokemon.canSetStatus(this.effect, true, false, user) ? score : 0;
  }
}
