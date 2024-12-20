import type { Pokemon } from "#app/field/pokemon";
import { BooleanHolder } from "#app/utils";
import type { UserMoveConditionFunc, Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Attribute that allows charge moves to resolve in 1 turn under a given condition.
 * Should only be used for {@linkcode ChargingMove | ChargingMoves} as a `chargeAttr`.
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
   * @param args
   *  - `[0]` a {@linkcode BooleanHolder | BooleanHolder} for the "instant charge" flag
   * @returns `true` if the instant charge condition is met; `false` otherwise.
   */
  override apply(user: Pokemon, _target: Pokemon | null, move: Move, args: any[]): boolean {
    const instantCharge = args[0];
    if (!(instantCharge instanceof BooleanHolder)) {
      return false;
    }

    if (this.condition(user, move)) {
      instantCharge.value = true;
      return true;
    }
    return false;
  }
}
