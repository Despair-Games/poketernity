import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { UserMoveConditionFunc } from "#types/UserMoveConditionFunc";
import type { BooleanHolder } from "#utils/common-utils";

/**
 * Attribute that allows charge moves to resolve in 1 turn under a set condition.
 * Should only be used for {@linkcode ChargingMove | charge moves} via `.chargeAttr()`.
 * @extends MoveAttr
 */
export class InstantChargeAttr extends MoveAttr {
  /** The condition in which the move with this attribute instantly charges */
  protected readonly condition: UserMoveConditionFunc;

  constructor(condition: UserMoveConditionFunc) {
    super(true);
    this.condition = condition;
  }

  /**
   * Flags the move with this attribute as instantly charged if this attribute's condition is met.
   * @param user the {@linkcode Pokemon} using the move
   * @param _target n/a
   * @param move the {@linkcode Move} associated with this attribute
   * @param instantCharge a {@linkcode BooleanHolder} for the "instant charge" flag
   * @returns `true` if the instant charge condition is met; `false` otherwise.
   */
  override apply(user: Pokemon, _target: Pokemon | null, move: Move, instantCharge: BooleanHolder): boolean {
    if (this.condition(user, move)) {
      instantCharge.value = true;
      return true;
    }
    return false;
  }
}
