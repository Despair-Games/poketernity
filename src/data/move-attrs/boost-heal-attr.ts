import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { HealAttr } from "#app/data/move-attrs/heal-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Heals the target or the user by either {@linkcode normalHealRatio} or {@linkcode boostedHealRatio}
 * depending on the evaluation of {@linkcode condition}
 * @extends HealAttr
 * @see {@linkcode apply}
 */
export class BoostHealAttr extends HealAttr {
  /** Healing received when {@linkcode condition} is false */
  private normalHealRatio: number;
  /** Healing received when {@linkcode condition} is true */
  private boostedHealRatio: number;
  /** The lambda expression to check against when boosting the healing value */
  private condition?: MoveConditionFunc;

  constructor(
    normalHealRatio: number,
    boostedHealRatio: number,
    showAnim?: boolean,
    selfTarget?: boolean,
    condition?: MoveConditionFunc,
  ) {
    super(normalHealRatio, showAnim, selfTarget);
    this.normalHealRatio = normalHealRatio;
    this.boostedHealRatio = boostedHealRatio;
    this.condition = condition;
  }

  /** Heals the given target. The heal ratio is boosted if this attribute's {@linkcode condition} is met. */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    const healRatio: number = (this.condition ? this.condition(user, target, move) : false)
      ? this.boostedHealRatio
      : this.normalHealRatio;
    this.addHealPhase(target, healRatio);
    return true;
  }
}
