import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { UserMoveConditionFunc } from "../move-conditions";

/**
 * Attribute that allows charge moves to resolve in 1 turn under a set condition.
 * Should only be used for {@linkcode ChargingMove charge moves} as a `chargeAttr`.
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
