import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { MoveCondition } from "#moves/move-condition";
import type { MoveConditionFunc } from "#types/move-types";
import type { BooleanHolder } from "#utils/common-utils";

export interface MoveAttrOptions {
  /** Does this attribute contribute to AI effect score when the move fails or has no effect? */
  appliesScoreOnFail?: boolean;
  /** Does this attribute override the AI's (-20) penalty when targeting an ally? */
  overridesAllyTargetPenalty?: boolean;
}

/**
 * Base class defining all {@linkcode Move} Attributes
 * @see {@linkcode apply}
 */
export abstract class MoveAttr {
  /** Should this {@linkcode Move} target the user? */
  public selfTarget: boolean;
  public readonly callsOtherMoves: boolean = false;
  protected options?: MoveAttrOptions;

  constructor(selfTarget: boolean = false, options?: MoveAttrOptions) {
    this.selfTarget = selfTarget;
    this.options = options;
  }

  /**
   * Defines whether or not this attribute contributes to effect score even when the move
   * is known to fail or have no effect at the time of evaluation.
   * @default false
   * @see {@linkcode getEffectScore}
   */
  public get appliesScoreOnFail(): boolean {
    return this.options?.appliesScoreOnFail ?? false;
  }

  /**
   * Defines whether or not this attribute overrides the generic ally target penalty of
   * (-20) and implements its own effect score against allies.
   * @default false
   * @see {@linkcode Move.getEffectScore}
   */
  public get overridesAllyTargetPenalty(): boolean {
    return this.options?.overridesAllyTargetPenalty ?? false;
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
  apply(_user: Pokemon | null, _target: Pokemon | null, _move: Move, ..._args: unknown[]): boolean {
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

  /**
   * Defines the integer Effect Score bonus (or penalty) granted by this attribute based on the
   * current game state. Effect Scores from a move's attributes are combined to form a move's
   * overall Effect Score, which helps determine the Enemy AI's move selection.
   *
   * For Attack Moves, the total Effect Score should rarely exceed (+1) and should almost never
   * exceed (+2). Status Moves' total Effect Score should rarely exceed (+3). You can also use
   * {@linkcode getRandomScore} to add variance to a score, which can also be helpful if a non-integer
   * score value seems appropriate.
   * @param user the {@linkcode EnemyPokemon} evaluating the move
   * @param target the {@linkcode Pokemon} the move is evaluated against
   * @param move the {@linkcode Move} being evaluated
   * @returns this attribute's `integer` score modifier.
   */
  public getEffectScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }

  /**
   * Uses a seeded chance roll to return one of two score values.
   * @param user the {@linkcode EnemyPokemon} evaluating effect scores under which the chance roll is seeded
   * @param chance the chance (%) to yield the maximum score. Assumed to be an integer in the range [0, 100].
   * @param hitScore the score given if the chance roll is successful. Defaults to `1`
   * @param missScore the score given if the chance roll is unsuccessful. Defaults to `0`
   * @returns either `maxScore` or `minScore`, depending on the chance roll's outcome.
   */
  protected getRandomScore(user: EnemyPokemon, chance: number, hitScore: number = 1, missScore: number = 0): number {
    return user.randSeedInt(100) < chance ? hitScore : missScore;
  }
}
