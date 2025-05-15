import type { TurnCommand } from "#app/turn-command-manager";
import type { TypeDamageMultiplier } from "#data/type";
import type { MoveId } from "#enums/move-id";
import type { AttackMoveResult } from "#types/attack-move-result";

export interface PokemonTurnData {
  turnCommand?: TurnCommand;
  flinched: boolean;
  acted: boolean;
  /** How many times the move should hit the target(s) */
  hitCount: number;
  /**
   * - `-1` = Calculate how many hits are left
   * - `0` = Move is finished
   */
  hitsLeft: number;
  totalDamageDealt: number;
  singleHitDamageDealt: number;
  damageTaken: number;
  attacksReceived: AttackMoveResult[];
  order: number;
  statStagesIncreased: boolean;
  statStagesDecreased: boolean;
  moveEffectiveness: TypeDamageMultiplier | null;
  combiningPledge?: MoveId;
  switchedInThisTurn: boolean;
  failedRunAway: boolean;
  joinedRound: boolean;
}
