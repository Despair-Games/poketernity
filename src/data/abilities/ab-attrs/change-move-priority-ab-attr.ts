import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

type AbAttrMoveCondition = (pokemon: Pokemon, move: Move) => boolean;

/**
 * This ability attribute changes the priority of the ability holder's moves by a specified amount if certain conditions have been met
 * +-----------------+--------------+-------------------------+
 * |  Ability Name   | Priority +/- |        Condition        |
 * +-----------------+--------------+-------------------------+
 * | Prankster       | +1           | Status moves            |
 * | Gale Wings      | +1           | Flying moves at full HP |
 * | Triage          | +3           | HP-Recovery Moves       |
 * | Mycellium Might | -0.2         | Status Moves            |
 * | Stall           | -0.2         |                         |
 * +-----------------+--------------+-------------------------+
 */
export class ChangeMovePriorityAbAttr extends AbAttr {
  /** The condition moves must follow for the priority change to apply */
  private readonly moveFunc: AbAttrMoveCondition;
  /** The amount of priority added or subtracted */
  private readonly changeAmount: number;

  constructor(moveFunc: AbAttrMoveCondition, changeAmount: number) {
    super(true);
    this._flags.add(AbAttrFlag.CHANGE_MOVE_PRIORITY);

    this.moveFunc = moveFunc;
    this.changeAmount = changeAmount;
  }

  override apply(pokemon: Pokemon, _simulated: boolean, move: Move, priority: NumberHolder): boolean {
    if (!this.moveFunc(pokemon, move)) {
      return false;
    }

    priority.value += this.changeAmount;
    return true;
  }
}
