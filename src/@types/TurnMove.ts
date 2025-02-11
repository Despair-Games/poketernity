import type { Move } from "#app/data/move";
import type { BattlerIndex } from "#enums/battler-index";
import type { MoveResult } from "#enums/move-result";

export interface TurnMove {
  move: Move;
  targets?: BattlerIndex[];
  result: MoveResult;
  virtual?: boolean;
  turn?: number;
}
