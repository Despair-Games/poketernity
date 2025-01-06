import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Attribute to modify move damage to a fixed value.
 * @extends MoveAttr
 * @see {@linkcode getDamage}
 */
export class FixedDamageAttr extends MoveAttr {
  private damage: number;

  constructor(damage: number) {
    super();

    this.damage = damage;
  }

  /**
   * Modifies damage to a set value.
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @param damage a {@linkcode NumberHolder} containing the move's damage for the current attack
   * @returns `true` if damage is successfully set
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, damage: NumberHolder): boolean {
    damage.value = this.getDamage(user, target, move);

    return true;
  }

  /**
   * Calculates the given move's fixed damage
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @returns the damage to set
   */
  public getDamage(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return this.damage;
  }
}
