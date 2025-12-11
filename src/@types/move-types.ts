import type { ConditionalProtectTag } from "#arena-tags/conditional-protect-tag";
import type { BattlerIndex, FieldBattlerIndex } from "#enums/battler-index";
import type { ElementalType } from "#enums/elemental-type";
import type { HitResult } from "#enums/hit-result";
import type { MoveId } from "#enums/move-id";
import type { MoveResult } from "#enums/move-result";
import type { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export type SubMove = new (...args: any[]) => Move;

export interface TurnMove {
  move: Move;
  targets: BattlerIndex[];
  result?: MoveResult;
  type: ElementalType;
  virtual?: boolean;
  turn?: number;
  ignorePP?: boolean;
}

export interface AttackMoveResult {
  moveId: MoveId;
  result: DamageResult;
  damage: number;
  isCritical: boolean;
  sourceId: number;
  sourceBattlerIndex: FieldBattlerIndex;
}

/** Interface containing the results of a damage calculation for a given move */
export interface DamageCalculationResult {
  /** `true` if the move was cancelled (thus suppressing "No Effect" messages) */
  cancelled: boolean;
  /** The effectiveness of the move */
  result: HitResult;
  /** The damage dealt by the move */
  damage: number;
}

export type DamageResult =
  | typeof HitResult.EFFECTIVE
  | typeof HitResult.SUPER_EFFECTIVE
  | typeof HitResult.NOT_VERY_EFFECTIVE
  | typeof HitResult.ONE_HIT_KO
  | typeof HitResult.OTHER
  | typeof HitResult.SELF_KO;

// TODO: Can these be combined into one? Should all of the params be optional in PAC?
export type PokemonAttackCondition = (user?: Pokemon, target?: Pokemon, move?: Move) => boolean;
export type PokemonDefendCondition = (target: Pokemon, user: Pokemon, move: Move) => boolean;
export type MoveConditionFunc = (user: Pokemon, target: Pokemon, move: Move) => boolean;

/**
 * A function to check if a move with the given {@linkcode MoveId}
 * can have its effects negated by a {@linkcode ConditionalProtectTag | conditional protection}
 * field effect (e.g. Wide Guard).
 */
export type ProtectConditionFunc = (moveId: MoveId) => boolean;

export type UserMoveConditionFunc = (user: Pokemon, move: Move) => boolean;

export type MoveMessageFunc = (user: Pokemon, target: Pokemon, move: Move) => string | undefined;

/** A list of {@linkcode MoveId | moves} learned by level up, in the form of `[PokemonLevel, MoveId][]` */
export type LevelMoves = [number, MoveId][];

/** A list mapping pokemon {@linkcode SpeciesId | species} to their {@linkcode LevelMoves | level up moves} */
export interface PokemonSpeciesLevelMoves {
  readonly [key: number]: LevelMoves;
}
