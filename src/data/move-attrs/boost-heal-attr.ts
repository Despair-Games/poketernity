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

  protected override getHealRatio(user: Pokemon, target: Pokemon, move: Move): number {
    if (this.condition && this.condition(user, target, move)) {
      return this.boostedHealRatio;
    } else {
      return this.normalHealRatio;
    }
  }
}
