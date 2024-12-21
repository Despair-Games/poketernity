import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import type { MoveCondition, MoveConditionFunc } from "../move-conditions";

/**
 * Base class defining all {@linkcode Move} Attributes
 * @abstract
 * @see {@linkcode apply}
 */

export abstract class MoveAttr {
  /** Should this {@linkcode Move} target the user? */
  public selfTarget: boolean;

  constructor(selfTarget: boolean = false) {
    this.selfTarget = selfTarget;
  }

  /**
   * Applies move attributes
   * @see {@linkcode applyMoveAttrsInternal}
   * @virtual
   * @param _user {@linkcode Pokemon} using the move
   * @param _target {@linkcode Pokemon} target of the move
   * @param _move {@linkcode Move} with this attribute
   * @param _args Set of unique arguments needed by this attribute
   * @returns true if application of the ability succeeds
   */
  apply(_user: Pokemon | null, _target: Pokemon | null, _move: Move, _args: any[]): boolean {
    return true;
  }

  /**
   * @virtual
   * @returns the {@linkcode MoveCondition} or {@linkcode MoveConditionFunc} for this {@linkcode Move}
   */
  getCondition(): MoveCondition | MoveConditionFunc | null {
    return null;
  }

  /**
   * @virtual
   * @param _user {@linkcode Pokemon} using the move
   * @param _target {@linkcode Pokemon} target of the move
   * @param _move {@linkcode Move} with this attribute
   * @param _cancelled {@linkcode BooleanHolder} which stores if the move should fail
   * @returns the string representing failure of this {@linkcode Move}
   */
  getFailedText(_user: Pokemon, _target: Pokemon, _move: Move, _cancelled: BooleanHolder): string | null {
    return null;
  }

  /**
   * Used by the Enemy AI to rank an attack based on a given user
   * @see {@linkcode EnemyPokemon.getNextMove}
   * @virtual
   */
  getUserBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }

  /**
   * Used by the Enemy AI to rank an attack based on a given target
   * @see {@linkcode EnemyPokemon.getNextMove}
   * @virtual
   */
  getTargetBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }
}
