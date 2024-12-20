import { MoveCategory } from "#enums/move-category";
import { MoveTarget } from "#enums/move-target";
import type { Moves } from "#enums/moves";
import type { Type } from "#enums/type";
import { Move } from "#app/data/move";

export class SelfStatusMove extends Move {
  constructor(
    id: Moves,
    type: Type,
    accuracy: number,
    pp: number,
    chance: number,
    priority: number,
    generation: number,
  ) {
    super(id, type, MoveCategory.STATUS, MoveTarget.USER, -1, accuracy, pp, chance, priority, generation);
  }
}
