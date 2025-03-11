import type { Move } from "#app/data/moves/move";
import type { BattlerIndex } from "#enums/battler-index";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveResult } from "#enums/move-result";

export interface TurnMove {
  move: Move;
  targets: BattlerIndex[];
  result?: MoveResult;
  type: ElementalType;
  virtual?: boolean;
  turn?: number;
  ignorePP?: boolean;
}
