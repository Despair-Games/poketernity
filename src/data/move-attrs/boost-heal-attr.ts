import type { Pokemon } from "#app/field/pokemon";
import type { MoveConditionFunc, Move } from "#app/data/move";
import { HealAttr } from "#app/data/move-attrs/heal-attr";

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

  /**
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} target of the move
   * @param move {@linkcode Move} with this attribute
   * @param _args N/A
   * @returns true if the move was successful
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, _args: any[]): boolean {
    const healRatio: number = (this.condition ? this.condition(user, target, move) : false)
      ? this.boostedHealRatio
      : this.normalHealRatio;
    this.addHealPhase(target, healRatio);
    return true;
  }
}
