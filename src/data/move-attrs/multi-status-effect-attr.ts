import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { randSeedItem } from "#app/utils";
import type { Move } from "#app/data/move";
import { StatusEffectAttr } from "#app/data/move-attrs/status-effect-attr";

export class MultiStatusEffectAttr extends StatusEffectAttr {
  public effects: StatusEffect[];

  constructor(effects: StatusEffect[], selfTarget?: boolean, turnsRemaining?: number, overrideStatus?: boolean) {
    super(effects[0], selfTarget, turnsRemaining, overrideStatus);
    this.effects = effects;
  }

  /** Randomly applies one of this attribute's {@linkcode effects status effects} onto the target */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    this.effect = randSeedItem(this.effects);
    const result = super.apply(user, target, move);
    return result;
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, false);
    const score = moveChance < 0 ? -10 : Math.floor(moveChance * -0.1);
    const pokemon = this.selfTarget ? user : target;

    return !pokemon.status && pokemon.canSetStatus(this.effect, true, false, user) ? score : 0;
  }
}
