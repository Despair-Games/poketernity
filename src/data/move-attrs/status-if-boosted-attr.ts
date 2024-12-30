import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to apply a status effect to the target if they have had their stats boosted this turn.
 * @extends MoveEffectAttr
 */
export class StatusIfBoostedAttr extends MoveEffectAttr {
  public effect: StatusEffect;

  constructor(effect: StatusEffect) {
    super(true);
    this.effect = effect;
  }

  /**
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param _move {@linkcode Move} N/A
   * @returns true
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    if (target.turnData.statStagesIncreased) {
      target.trySetStatus(this.effect, true, user);
    }
    return true;
  }
}
