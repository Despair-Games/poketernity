import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { StatusEffectAttr } from "#moves/status-effect-attr";
import { randSeedItem } from "#utils/random-utils";

/**
 * Attribute to randomly apply one of a {@linkcode effects | set of status effects}
 * onto the target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Tri_Attack_(move) | Tri-Attack}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Dire_Claw_(move) | Dire Claw}.
 * @extends StatusEffectAttr
 */
export class MultiStatusEffectAttr extends StatusEffectAttr {
  public effects: StatusEffect[];

  constructor(effects: StatusEffect[], selfTarget?: boolean, turnsRemaining?: number, overrideStatus?: boolean) {
    super(effects[0], selfTarget, turnsRemaining, overrideStatus);
    this.effects = effects;
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    this.effect = randSeedItem(this.effects);
    return super.applyEffect(user, target, move);
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const moveChance = this.getMoveChance(user, target, move, false);
    const score = moveChance < 0 ? -10 : Math.floor(moveChance * -0.1);
    const pokemon = this.selfTarget ? user : target;

    return !pokemon.hasNonVolatileStatusEffect() && pokemon.canSetStatus(this.effect, true, false, user) ? score : 0;
  }
}
